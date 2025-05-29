<template>
  <div class="empty-state">
    <inbox class="empty-icon" />
    <h3>No items to display</h3>
    <p v-if="feedStore.showUnreadOnly">Try turning off the unread filter or add more feeds</p>
    <p v-else>Try adding some feeds to get started</p>
  </div>
</template>

<script setup>
import { Inbox } from 'lucide-vue-next'
import { useFeedStore } from '~/stores/feedStore'

const feedStore = useFeedStore()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--text-light);
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}
</style>