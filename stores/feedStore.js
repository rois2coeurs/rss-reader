import {defineStore} from 'pinia'

function convertItemsFromXml(xmlDoc, source) {
  let items = Array.from(xmlDoc.querySelectorAll("item")).map(item => ({
          id: `${source.id}-${item.querySelector("guid")?.textContent || Date.now() + '-' + Math.random()}`,
        sourceId: source.id,
        sourceName: source.name,
        sourceType: "rss",
        title: item.querySelector("title")?.textContent || "",
        summary: item.getElementsByTagName("content:encoded")[0]?.textContent || item.querySelector("description")?.textContent || "",
        date: new Date(item.querySelector("pubDate")?.textContent || Date.now()),
    read: false,
    bookmarked: false,
    link: item.querySelector("link")?.textContent || ""
  }));
  return items;
}

export const useFeedStore = defineStore('feed', {
  state: () => ({
    feedSources: [
      {id: 'all', name: 'All Feeds', type: 'all', unread: 12},
      {id: 'bookmarks', name: 'Bookmarks', type: 'bookmark', unread: 0}
    ],
    feedItems: [],
    selectedSource: 'all',
    selectedItem: null,
    searchQuery: '',
    showUnreadOnly: false
  }),

  getters: {
    currentSourceName: (state) => {
      if (state.selectedSource === 'all') return 'All Feeds'
      const source = state.feedSources.find(s => s.id === state.selectedSource)
      return source ? source.name : 'Unknown'
    },

    currentSourceUnread: (state) => {
      if (state.selectedSource === 'all') {
        return state.feedItems.filter(item => !item.read).length
      }
      return state.feedItems.filter(item =>
        item.sourceId === state.selectedSource && !item.read
      ).length
    },

    filteredFeedItems: (state) => {
      let items = state.feedItems

      // Filter by source
      if (state.selectedSource === 'bookmarks') {
        items = items.filter(item => item.bookmarked)
      } else if (state.selectedSource !== 'all') {
        items = items.filter(item => item.sourceId === state.selectedSource)
      }

      // Filter by read status
      if (state.showUnreadOnly) {
        items = items.filter(item => !item.read)
      }

      // Filter by search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        items = items.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query)
        )
      }

      // Sort by date (newest first)
      return items.sort((a, b) => b.date - a.date)
    },

    bookmarkedItems: (state) => {
      return state.feedItems.filter(item => item.bookmarked)
    }
  },

  actions: {
    selectSource(id) {
      this.selectedSource = id
    },

    markAsRead(id) {
      const item = this.feedItems.find(item => item.id === id)
      if (item) {
        item.read = true
        this.updateUnreadCounts()
        this.save()
      }
    },

    markAllAsRead(sourceId) {
      this.feedItems.forEach(item => {
        if (sourceId === 'all' || item.sourceId === sourceId) {
          item.read = true
        }
      })
      this.updateUnreadCounts()
      this.save()
    },

    toggleBookmark(id) {
      const item = this.feedItems.find(item => item.id === id)
      if (item) {
        item.bookmarked = !item.bookmarked
        this.updateBookmarksCount()
        this.save()
      }
    },

    updateUnreadCounts() {
      this.feedSources.forEach(source => {
        if (source.id === 'all') {
          source.unread = this.feedItems.filter(item => !item.read).length
        } else {
          source.unread = this.feedItems.filter(item =>
            item.sourceId === source.id && !item.read
          ).length
        }
      })
    },

    updateBookmarksCount() {
      const bookmarkSource = this.feedSources.find(source => source.id === 'bookmarks')
      if (bookmarkSource) {
        bookmarkSource.unread = this.feedItems.filter(item => item.bookmarked && !item.read).length
      }
    },

    async addFeed(url) {
      const newId = `feed-${Date.now()}`

      const data = await fetch("/api/rss?url=" + url);

      const xmlText = await data.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const name = xmlDoc.querySelector("channel > title")?.textContent || "Unnamed Feed";

      let source = {
        id: newId,
        name,
        type: "rss",
        url
      }

      const items = convertItemsFromXml(xmlDoc, source);

      source.unread = items.length;

      this.feedItems.push(...items);
      this.updateUnreadCounts();

      this.feedSources.push(source);
      this.save();
    },

    async refreshFeedItems() {
      const sources = this.feedSources.filter(source => source.type === "rss");

      for (const source of sources) {
        try {
          const data = await fetch(`/api/rss?url=${source.url}`);
          const xmlText = await data.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "application/xml");

          let items = convertItemsFromXml(xmlDoc, source);

          items = items.filter(e => !this.feedItems.some(fi => fi.id === e.id))
          items.push(...this.feedItems);
          this.feedItems = items;
        } catch (e) {
          console.error(e);
        }

      }
      this.updateUnreadCounts();
      this.save();
    },

    selectItem(item) {
      this.selectedItem = item
      this.markAsRead(item.id)
    },

    clearSelectedItem() {
      this.selectedItem = null
    },

    save() {
      localStorage.setItem('feedSources', JSON.stringify(this.feedSources));
      localStorage.setItem('feedItems', JSON.stringify(this.feedItems));
    },

    load() {
      const storedFeedSources = localStorage.getItem('feedSources');
      const storedFeedItems = localStorage.getItem('feedItems');

      if (storedFeedSources) {
        this.feedSources = JSON.parse(storedFeedSources);
      }

      if (storedFeedItems) {
        this.feedItems = JSON.parse(storedFeedItems);
      }

      this.updateUnreadCounts();
    }
  }
})