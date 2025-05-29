<template>
  <div 
    class="feed-source" 
    :class="{ 'active': isActive, 'collapsed-item': isCollapsed }"
    @click="$emit('select', source.id)"
  >
    <div class="source-icon" :class="source.type">
      <rss v-if="source.type === 'rss'" />
      <message-circle v-else-if="source.type === 'discord'" />
      <bookmark v-else-if="source.type === 'bookmark'" />
      <globe v-else />
    </div>
    <span class="source-name" v-if="!isCollapsed">{{ source.name }}</span>
    <span class="unread-badge" v-if="source.unread > 0">{{ source.unread }}</span>
    <button 
      v-if="!isCollapsed && source.unread > 0" 
      class="mark-read-btn" 
      @click.stop="$emit('mark-all-read', source.id)"
      title="Mark all as read"
    >
      <check />
    </button>
  </div>
</template>

<script setup>
import { Rss, MessageCircle, Bookmark, Globe, Check } from 'lucide-vue-next'

defineProps({
  source: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select', 'mark-all-read'])
</script>

<style scoped>
.feed-source {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background-color 0.2s;
}

.feed-source:hover {
  background-color: var(--hover);
}

.feed-source.active {
  background-color: var(--hover);
  border-left-color: var(--primary);
}

.feed-source.collapsed-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.source-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 0.75rem;
}

.collapsed-item .source-icon {
  margin-right: 0;
}

.source-icon.rss {
  color: #f97316;
}

.source-icon.discord {
  color: #5865f2;
}

.source-icon.all {
  color: var(--primary);
}

.source-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  background-color: var(--primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 1.5rem;
  text-align: center;
}

.mark-read-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-light);
  opacity: 0;
  transition: opacity 0.2s, background-color 0.2s;
  margin-left: auto;
}

.feed-source:hover .mark-read-btn {
  opacity: 1;
}

.mark-read-btn:hover {
  background-color: var(--hover);
  color: var(--primary);
}
</style>