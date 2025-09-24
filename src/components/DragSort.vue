<template>
  <div class="drag-sort-container">
    <h3>垂直拖拽列表</h3>
    <draggable
      v-model="verticalItems"
      item-key="id"
      tag="ul"
      class="drag-list vertical-list"
      group="items"
    >
      <template #item="{ element }">
        <li class="drag-item">{{ element.text }}</li>
      </template>
    </draggable>

    <h3>水平拖拽列表</h3>
    <draggable
      v-model="horizontalItems"
      item-key="id"
      tag="ul"
      class="drag-list horizontal-list"
      group="items"
      direction="horizontal"
    >
      <template #item="{ element }">
        <li class="drag-item">{{ element.text }}</li>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

const verticalItems = ref([
  { id: 1, text: '垂直选项一' },
  { id: 2, text: '垂直选项二' },
  { id: 3, text: '垂直选项三' },
  { id: 4, text: '垂直选项四' }
])

const horizontalItems = ref([
  { id: 5, text: '水平选项一' },
  { id: 6, text: '水平选项二' },
  { id: 7, text: '水平选项三' }
])
</script>

<style scoped>
.drag-sort-container {
  max-width: 600px;
  margin: 2rem auto;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px #0001;
}

.drag-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 50px;
  padding: 0.5rem;
  display: flex;
}

.vertical-list {
  flex-direction: column;
}

.horizontal-list {
  flex-direction: row;
  flex-wrap: wrap; /* 确保内容超出时能换行 */
}

.drag-item {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  cursor: grab;
  margin: 0.25rem;
  transition: transform 0.3s ease;
}

/* 拖拽时隐藏被拖拽的元素，只显示 ghost */
.sortable-ghost {
  opacity: 0;
}

@media (prefers-color-scheme: dark) {
  .drag-sort-container {
    background: #222;
  }
  .drag-list {
    border-color: #555;
  }
  .drag-item {
    background: #333;
    color: #fff;
    border-color: #555;
  }
}
</style>