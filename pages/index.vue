<template>
  <div>
    <div class="header">
      <div class="search-container">
        <search class="search-icon" />
        <input 
          type="text" 
          placeholder="Search feeds..." 
          v-model="feedStore.searchQuery" 
          class="search-input" 
        />
      </div>
      <div class="view-options">
        <button 
          class="view-btn" 
          :class="{ 'active': uiStore.viewMode === 'card' }" 
          @click="uiStore.setViewMode('card')"
        >
          <layout />
        </button>
        <button 
          class="view-btn" 
          :class="{ 'active': uiStore.viewMode === 'list' }" 
          @click="uiStore.setViewMode('list')"
        >
          <list />
        </button>
      </div>
      <div class="filter-options">
        <button 
          class="filter-btn" 
          :class="{ 'active': feedStore.showUnreadOnly }" 
          @click="feedStore.showUnreadOnly = !feedStore.showUnreadOnly"
        >
          <filter />
          <span>Unread only</span>
        </button>
      </div>
    </div>
    
    <FeedListContainer />
  </div>
</template>

<script setup>
import { Search, Layout, List, Filter } from 'lucide-vue-next'
import { useFeedStore } from '~/stores/feedStore'
import { useUiStore } from '~/stores/uiStore'
import FeedListContainer from '~/components/FeedList/FeedListContainer.vue'

const feedStore = useFeedStore()
const uiStore = useUiStore()

onMounted( () => {
  feedStore.load();
  setInterval(async () => {
    await feedStore.refreshFeedItems();
  }, 1000 * 60)
})
</script>

<style scoped>
.header {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--sidebar-bg);
}

.search-container {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  width: 1rem;
  height: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 2.25rem;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  background-color: var(--background);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.view-options, .filter-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-btn, .filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-light);
  font-size: 0.875rem;
  transition: all 0.2s;
}

.view-btn:hover, .filter-btn:hover {
  background-color: var(--hover);
}

.view-btn.active, .filter-btn.active {
  color: var(--primary);
  background-color: rgba(79, 70, 229, 0.1);
}
</style>