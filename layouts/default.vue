<template>
  <div class="app-container">
    <SidebarContainer />

    <div class="main-content">
      <slot />
    </div>

    <DetailViewContainer v-if="uiStore.showDetailView && feedStore.selectedItem" />

    <AddFeedModal v-if="uiStore.showAddFeedModal" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useFeedStore } from '~/stores/feedStore'
import { useUiStore } from '~/stores/uiStore'
import SidebarContainer from '~/components/Sidebar/SidebarContainer.vue'
import DetailViewContainer from '~/components/DetailView/DetailViewContainer.vue'
import AddFeedModal from '~/components/Modals/AddFeedModal.vue'

const feedStore = useFeedStore()
const uiStore = useUiStore()

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (uiStore.readingMode) {
      uiStore.toggleReadingMode()
    } else if (uiStore.showDetailView) {
      uiStore.closeDetailView()
      setTimeout(() => {
        feedStore.clearSelectedItem()
      }, 300)
    }
  }
}

onMounted(() => {
  feedStore.updateUnreadCounts()
  feedStore.updateBookmarksCount()

  // Add event listener for escape key
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  // Remove event listener
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style>
@import '~/assets/css/variables.css';
@import '~/assets/css/main.css';

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>