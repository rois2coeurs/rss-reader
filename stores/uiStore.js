import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarCollapsed: false,
    viewMode: 'card',
    showDetailView: false,
    readingMode: false,
    showAddFeedModal: false,
    showSettings: false
  }),

  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setViewMode(mode) {
      this.viewMode = mode
    },

    openDetailView() {
      this.showDetailView = true
    },

    closeDetailView() {
      this.showDetailView = false
      this.readingMode = false
    },

    toggleReadingMode() {
      this.readingMode = !this.readingMode
    },

    openAddFeedModal() {
      this.showAddFeedModal = true
    },

    closeAddFeedModal() {
      this.showAddFeedModal = false
    },

    openSettings() {
      this.showSettings = true
    },

    closeSettings() {
      this.showSettings = false
    }
  }
})