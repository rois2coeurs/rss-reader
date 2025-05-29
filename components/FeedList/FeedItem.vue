<template>
  <div
    class="feed-item"
    :class="{ 'unread': !item.read }"
    @click="$emit('view', item)"
  >
    <div class="item-header">
      <div class="source-info">
        <div class="source-icon small" :class="item.sourceType">
          <rss v-if="item.sourceType === 'rss'" />
          <message-circle v-else-if="item.sourceType === 'discord'" />
          <globe v-else />
        </div>
        <span class="source-name">{{ item.sourceName }}</span>
      </div>
      <span class="item-date">{{ formatDate(item.date) }}</span>
    </div>
    <h3 class="item-title">{{ item.title }}</h3>
    <p class="item-summary" v-html="sanitizeHtmlContent(item.summary)" />
    <div class="item-actions">
      <button class="action-btn" @click.stop="$emit('toggle-bookmark', item.id)">
        <bookmark v-if="!item.bookmarked" />
        <bookmark-check v-else />
      </button>
      <button class="action-btn" @click.stop="$emit('share', item)">
        <share />
      </button>
      <button class="action-btn" @click.stop="$emit('open-external', item.link)">
        <external-link />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Rss, MessageCircle, Globe, Bookmark, BookmarkCheck, Share, ExternalLink } from 'lucide-vue-next'
import { useFormatDate } from '~/composables/useFormatDate'
import DOMPurify from 'dompurify';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'toggle-bookmark', 'share', 'open-external'])

const { formatDate } = useFormatDate()
function sanitizeHtmlContent(content) {
  return DOMPurify.sanitize(content);
}
</script>

<style scoped>
.feed-item {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  max-height: 230px;
}

.feed-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.feed-item.unread {
  background-color: var(--unread);
  border-left: 3px solid var(--unread-border);
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.source-icon.small {
  width: 16px;
  height: 16px;
}

.item-date {
  font-size: 0.75rem;
  color: var(--text-light);
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.item-summary {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
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