<template>
  <div class="detail-view" :class="{ 'fullscreen': uiStore.readingMode }">
    <div class="detail-header">
      <button class="back-btn" @click="closeDetailView">
        <chevron-left />
        <span>Back to list</span>
      </button>
      <div class="detail-actions">
        <button class="action-btn" @click="uiStore.toggleReadingMode" title="Reading Mode">
          <maximize-2 v-if="!uiStore.readingMode" />
          <minimize-2 v-else />
        </button>
        <button class="action-btn" @click="toggleBookmark" title="Bookmark">
          <bookmark v-if="!feedStore.selectedItem.bookmarked" />
          <bookmark-check v-else />
        </button>
        <button class="action-btn" @click="shareItem" title="Share">
          <share />
        </button>
        <button class="action-btn" @click="openExternal" title="Open in Browser">
          <external-link />
        </button>
      </div>
    </div>

    <ArticleContent />
  </div>
</template>

<script setup>
import { ChevronLeft, Maximize2, Minimize2, Bookmark, BookmarkCheck, Share, ExternalLink } from 'lucide-vue-next'
import { useFeedStore } from '~/stores/feedStore'
import { useUiStore } from '~/stores/uiStore'
import ArticleContent from './ArticleContent.vue'

const feedStore = useFeedStore()
const uiStore = useUiStore()

const closeDetailView = () => {
  uiStore.closeDetailView()
  setTimeout(() => {
    feedStore.clearSelectedItem()
  }, 300)
}

const toggleBookmark = () => {
  if (feedStore.selectedItem) {
    feedStore.toggleBookmark(feedStore.selectedItem.id)
  }
}

const shareItem = () => {
  if (feedStore.selectedItem) {
    console.log('Sharing item:', feedStore.selectedItem.title)
  }
}

const openExternal = () => {
  if (feedStore.selectedItem) {
    console.log('Opening URL:', feedStore.selectedItem.link)
  }
}
</script>

<style scoped>
.detail-view {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 800px;
  background-color: var(--card-bg);
  border-left: 1px solid var(--border);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: slide-in 0.3s ease;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.detail-view.fullscreen {
  max-width: 100%;
  left: 0;
  background-color: var(--reading-bg);
}

.detail-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--card-bg);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  font-size: 0.875rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: var(--hover);
}

.detail-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-light);
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--hover);
  color: var(--primary);
}
</style>