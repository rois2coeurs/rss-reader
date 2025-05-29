<template>
  <div class="modal-overlay" @click="uiStore.closeAddFeedModal">
    <div class="modal" @click.stop>
      <h2>Add New Feed</h2>
      <div class="form-group">
        <label>Feed Type</label>
        <div class="feed-type-options">
          <button
            class="feed-type-btn"
            :class="{ 'active': newFeedType === 'rss' }"
            @click="newFeedType = 'rss'"
          >
            <rss />
            <span>RSS</span>
          </button>
          <button
            class="feed-type-btn"
            :class="{ 'active': newFeedType === 'discord' }"
            @click="newFeedType = 'discord'"
          >
            <message-circle />
            <span>Discord</span>
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Feed Name</label>
        <input type="text" v-model="newFeedName" placeholder="My Feed" />
      </div>
      <div class="form-group">
        <label>Feed URL</label>
        <input type="text" v-model="newFeedUrl" placeholder="https://example.com/feed.xml" />
      </div>
      <div class="modal-actions">
        <button class="cancel-btn" @click="uiStore.closeAddFeedModal">Cancel</button>
        <button
          class="add-btn"
          @click="addFeed"
          :disabled="!newFeedName || !newFeedUrl"
        >
          Add Feed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Rss, MessageCircle } from 'lucide-vue-next'
import { useFeedStore } from '~/stores/feedStore'
import { useUiStore } from '~/stores/uiStore'

const feedStore = useFeedStore()
const uiStore = useUiStore()

const newFeedType = ref('rss')
const newFeedName = ref('')
const newFeedUrl = ref('')

const addFeed = () => {
  feedStore.addFeed(newFeedUrl.value)
  newFeedName.value = ''
  newFeedUrl.value = ''
  uiStore.closeAddFeedModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--card-bg);
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.modal h2 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.feed-type-options {
  display: flex;
  gap: 1rem;
}

.feed-type-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
}

.feed-type-btn:hover {
  background-color: var(--hover);
}

.feed-type-btn.active {
  border-color: var(--primary);
  background-color: rgba(79, 70, 229, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn, .add-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
}

.cancel-btn:hover {
  background-color: var(--hover);
}

.add-btn {
  background-color: var(--primary);
  border: none;
  color: white;
}

.add-btn:hover {
  background-color: var(--primary-dark);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>