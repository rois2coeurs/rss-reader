<template>
  <div class="detail-content" :class=" { 'reading-mode': uiStore.readingMode }">
    <div class="detail-meta">
      <div class="source-info">
        <div class="source-icon" :class="feedStore.selectedItem.sourceType">
          <rss v-if="feedStore.selectedItem.sourceType === 'rss'"/>
          <message-circle v-else-if="feedStore.selectedItem.sourceType === 'discord'"/>
          <globe v-else/>
        </div>
        <span class="source-name">{{ feedStore.selectedItem.sourceName }}</span>
      </div>
      <span class="item-date">{{ formatDate(feedStore.selectedItem.date) }}</span>
    </div>

    <h1 class="detail-title">{{ feedStore.selectedItem.title }}</h1>

    <div class="detail-body">
      <div v-html="sanitizeHtmlContent(feedStore.selectedItem.summary)"></div>
    </div>
  </div>
</template>

<script setup>
import { Rss, MessageCircle, Globe } from 'lucide-vue-next'
import { useFeedStore } from '~/stores/feedStore'
import { useUiStore } from '~/stores/uiStore'
import { useFormatDate } from '~/composables/useFormatDate'
import { computed } from 'vue'
import DOMPurify from 'dompurify';


const feedStore = useFeedStore()
const uiStore = useUiStore()
const { formatDate } = useFormatDate()

function sanitizeHtmlContent(content) {
  return DOMPurify.sanitize(content);
}

const sourceTypeIcon = computed(() => {
  switch (feedStore.selectedItem.sourceType) {
    case 'rss':
      return 'rss'
    case 'discord':
      return 'discord'
    default:
      return 'globe'
  }
})
</script>

<style scoped>
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  transition: all 0.3s ease;
}

.detail-content.reading-mode {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem;
  font-size: 1.125rem;
  line-height: 1.8;
}

.detail-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.source-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.source-icon.rss {
  color: #f97316;
}

.source-icon.discord {
  color: #5865f2;
}

.item-date {
  font-size: 0.75rem;
  color: var(--text-light);
}

.detail-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  line-height: 1.3;
}

.reading-mode .detail-title {
  font-size: 2.25rem;
  margin-bottom: 2.5rem;
}

.detail-body {
  font-size: 1rem;
  line-height: 1.7;
}

.reading-mode .detail-body {
  font-size: 1.125rem;
  line-height: 1.8;
}

.detail-body p {
  margin-bottom: 1.5rem;
}

.reading-mode .detail-body p {
  margin-bottom: 2rem;
}

.detail-body h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
}

.reading-mode .detail-body h2 {
  font-size: 1.75rem;
  margin: 3rem 0 1.5rem;
}

.detail-body ul {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.reading-mode .detail-body ul {
  margin-bottom: 2rem;
  padding-left: 2rem;
}

.detail-body li {
  margin-bottom: 0.5rem;
}

.reading-mode .detail-body li {
  margin-bottom: 0.75rem;
}

.detail-body blockquote {
  border-left: 4px solid var(--primary);
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--text-light);
}

.reading-mode .detail-body blockquote {
  padding-left: 1.5rem;
  margin: 2.5rem 0;
  font-size: 1.25rem;
}

.mock-content {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}
</style>