import { defineStore } from 'pinia'

export const useFeedStore = defineStore('feed', {
  state: () => ({
    feedSources: [
      { id: 'all', name: 'All Feeds', type: 'all', unread: 12 },
      { id: 'tech', name: 'Tech News', type: 'rss', unread: 5 },
      { id: 'dev', name: 'Dev Community', type: 'discord', unread: 7 },
      { id: 'design', name: 'Design Inspiration', type: 'rss', unread: 0 },
      { id: 'bookmarks', name: 'Bookmarks', type: 'bookmark', unread: 0 }
    ],
    feedItems: [
      {
        id: '1',
        sourceId: 'tech',
        sourceName: 'Tech News',
        sourceType: 'rss',
        title: 'Bun v1.2 Released with Improved Node Compatibility',
        summary: 'The latest version of Bun brings better Node.js compatibility and performance improvements.',
        date: new Date(2023, 4, 15),
        read: false,
        bookmarked: false,
        link: 'https://bun.sh'
      },
      {
        id: '2',
        sourceId: 'tech',
        sourceName: 'Tech News',
        sourceType: 'rss',
        title: 'Vue 3.3 Introduces New Composition API Features',
        summary: 'The latest Vue update brings improvements to the Composition API and better TypeScript integration.',
        date: new Date(2023, 4, 10),
        read: true,
        bookmarked: true,
        link: 'https://vuejs.org'
      },
      {
        id: '3',
        sourceId: 'dev',
        sourceName: 'Dev Community',
        sourceType: 'discord',
        title: 'Weekly Code Challenge: Build a RSS Reader',
        summary: 'Join our weekly code challenge and build a RSS reader application using your favorite tech stack.',
        date: new Date(2023, 4, 12),
        read: false,
        bookmarked: false,
        link: 'https://discord.com'
      },
      {
        id: '4',
        sourceId: 'dev',
        sourceName: 'Dev Community',
        sourceType: 'discord',
        title: 'Live Coding Session: Desktop Apps with Vue',
        summary: 'Join us for a live coding session where we build desktop applications using Vue and Electron.',
        date: new Date(2023, 4, 8),
        read: false,
        bookmarked: false,
        link: 'https://discord.com'
      },
      {
        id: '5',
        sourceId: 'design',
        sourceName: 'Design Inspiration',
        sourceType: 'rss',
        title: 'Minimalist UI Design Trends for 2023',
        summary: 'Explore the latest minimalist UI design trends that are dominating the digital landscape in 2023.',
        date: new Date(2023, 4, 5),
        read: true,
        bookmarked: false,
        link: 'https://example.com'
      }
    ],
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
      }
    },

    markAllAsRead(sourceId) {
      this.feedItems.forEach(item => {
        if (sourceId === 'all' || item.sourceId === sourceId) {
          item.read = true
        }
      })
      this.updateUnreadCounts()
    },

    toggleBookmark(id) {
      const item = this.feedItems.find(item => item.id === id)
      if (item) {
        item.bookmarked = !item.bookmarked
        this.updateBookmarksCount()
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

      const data = await fetch("/api/rss?url="+url);

      const xmlText = await data.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const name = xmlDoc.querySelector("channel > title")?.textContent || "Unnamed Feed";

      const items = Array.from(xmlDoc.querySelectorAll("item")).map(item => ({
        id: `item-${Date.now()}-${Math.random()}`,
        sourceId: newId,
        sourceName: name,
        sourceType: "rss",
        title: item.querySelector("title")?.textContent || "",
        summary: item.querySelector("description")?.textContent || "",
        date: new Date(item.querySelector("pubDate")?.textContent || Date.now()),
        read: false,
        bookmarked: false,
        link: item.querySelector("link")?.textContent || ""
      }));


      this.feedItems.push(...items);
      this.updateUnreadCounts();

      this.feedSources.push({
        id: newId,
        name,
        type: "rss",
        unread: items.length
      })

    },

    selectItem(item) {
      this.selectedItem = item
      this.markAsRead(item.id)
    },

    clearSelectedItem() {
      this.selectedItem = null
    }
  }
})