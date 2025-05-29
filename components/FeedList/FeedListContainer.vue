<template>
  <div class="feed-content">
    <h2 class="content-title">
      {{ feedStore.currentSourceName }}
      <span class="unread-count" v-if="feedStore.currentSourceUnread > 0">
        {{ feedStore.currentSourceUnread }} unread
      </span>
    </h2>

    <div class="feed-items" :class="uiStore.viewMode">
      <FeedItem
        v-for="item in feedStore.filteredFeedItems"
        :key="item.id"
        :item="item"
        @view="viewItem"
        @toggle-bookmark="toggleBookmark"
        @share="shareItem"
        @open-external="openExternal"
      />

      <EmptyState v-if="feedStore.filteredFeedItems.length === 0" />
    </div>
  </div>
</template>

<script setup>
import { useFeedStore } from '~/stores/feedStore'
import { useUiStore } from '~/stores/uiStore'
import FeedItem from './FeedItem.vue'
import EmptyState from './EmptyState.vue'

const feedStore = useFeedStore()
const uiStore = useUiStore()

const viewItem = (item) => {
  feedStore.selectItem(item)
  uiStore.openDetailView()
}

const toggleBookmark = (id) => {
  feedStore.toggleBookmark(id)
}

const shareItem = (item) => {
  console.log('Sharing item:', item.title)
}

const openExternal = (url) => {
    window.location.href = url;
}
</script>

<style scoped>
.feed-content {
  flex: 1;
  overflow-y: scroll;
  padding: 1rem;
  max-height: 90vh;
}

.content-title {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.unread-count {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-light);
}

.feed-items {
  display: grid;
  gap: 1rem;
}

.feed-items.card {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.feed-items.list {
  grid-template-columns: 1fr;
}
</style>