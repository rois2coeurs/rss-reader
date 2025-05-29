<template>
  <div class="sidebar" :class="{ 'collapsed': uiStore.sidebarCollapsed }">
    <div class="sidebar-header">
      <h1 class="app-title">FeedReader</h1>
      <button class="collapse-btn" @click="uiStore.toggleSidebar">
        <chevrons-left v-if="!uiStore.sidebarCollapsed" />
        <chevrons-right v-else />
      </button>
    </div>
    
    <div class="feed-sources">
      <h2 class="section-title" v-if="!uiStore.sidebarCollapsed">Feed Sources</h2>
      <FeedSourceItem 
        v-for="source in feedStore.feedSources" 
        :key="source.id"
        :source="source"
        :is-active="feedStore.selectedSource === source.id"
        :is-collapsed="uiStore.sidebarCollapsed"
        @select="selectSource"
        @mark-all-read="markAllAsRead"
      />
    </div>
    
    <div class="sidebar-footer" v-if="!uiStore.sidebarCollapsed">
      <button class="add-feed-btn" @click="uiStore.openAddFeedModal">
        <plus-circle />
        <span>Add Feed</span>
      </button>
      <button class="settings-btn" @click="uiStore.openSettings">
        <settings />
        <span>Settings</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ChevronsLeft, ChevronsRight, PlusCircle, Settings } from 'lucide-vue-next'
import { useFeedStore } from '~/stores/feedStore'
import { useUiStore } from '~/stores/uiStore'
import FeedSourceItem from './FeedSourceItem.vue'
import { onMounted } from 'vue';

const feedStore = useFeedStore()
const uiStore = useUiStore()

const selectSource = (id) => {
  feedStore.selectSource(id)
  if (uiStore.showDetailView) {
    uiStore.closeDetailView()
    setTimeout(() => {
      feedStore.clearSelectedItem()
    }, 300)
  }
}

const markAllAsRead = (sourceId) => {
  feedStore.markAllAsRead(sourceId)
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 70px;
  min-width: 70px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.collapse-btn {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.collapse-btn:hover {
  background-color: var(--hover);
}

.feed-sources {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-light);
  padding: 0 1rem;
  margin-bottom: 0.5rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-feed-btn, .settings-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.add-feed-btn:hover, .settings-btn:hover {
  background-color: var(--hover);
}
</style>