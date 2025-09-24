<template>
  <div class="match-pairs">
    <div class="candidates">
      <h3>备选池</h3>
      <div class="candidate-list">
        <draggable
          v-model="state.candidates"
          item-key="id"
          tag="div"
          class="candidate-container"
          :group="{ name: 'items', pull: true, put: true }"
          :sort="false"
        >
          <template #item="{ element }">
            <div class="candidate">{{ element.text }}</div>
          </template>
        </draggable>
      </div>
    </div>

    <div class="targets">
      <h3>目标池</h3>
      <div
        v-for="(target, targetIndex) in state.targets"
        :key="target.id"
        class="target-slot"
      >
        <draggable
          v-model="state.targets[targetIndex].value"
          item-key="id"
          tag="div"
          class="placed-container"
          :group="{ name: 'items', pull: true, put: true }"
          :list="state.targets[targetIndex].value"
          :sort="false"
        >
          <template #item="{ element }">
            <div class="placed-item">{{ element.text }}</div>
          </template>
          <template #footer>
            <div v-if="state.targets[targetIndex].value.length === 0" class="placeholder">拖到这里</div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import draggable from 'vuedraggable';

const state = reactive({
  candidates: [
    { id: 1, text: '选项A' },
    { id: 2, text: '选项B' },
  ],
  targets: [
    { id: 1, expectedId: 1, value: [] },
    { id: 2, expectedId: 2, value: [] },
  ],
});
</script>

<style scoped>
.match-pairs {
  display: flex;
  justify-content: center;
  gap: 40px;
  font-family: Arial, sans-serif;
}

/* 备选池 */
.candidates, .targets {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 140px;
}
.candidate-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.candidate-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100px;
  border: 1px dashed #aaa;
  padding: 10px;
}

.candidate {
  border: 1px solid #333;
  padding: 10px;
  background-color: #f9f9f9;
  text-align: center;
  cursor: grab;
  transition: transform 0.2s;
}

/* 目标池 */
.target-slot {
  border: 1px dashed #333;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placed-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placed-item {
  border: 1px solid #333;
  padding: 10px;
  background-color: #fff8c4;
  width: 100px;
  text-align: center;
  cursor: grab;
}

.placeholder {
  color: #aaa;
  font-size: 14px;
}

/* 拖拽动画效果 */
.sortable-ghost {
  opacity: 0;
}
.sortable-chosen {
  background-color: #dbeafe;
}

/* 暗主题适配 */
@media (prefers-color-scheme: dark) {
  .candidate {
    background-color: #222;
    color: #fff;
    border: 1px solid #444;
  }
  .placed-item {
    background-color: #333;
    color: #ffd700;
    border: 1px solid #666;
  }
  .candidate-container, .target-slot {
    border-color: #555;
  }
  .placeholder {
    color: #888;
  }
}
</style>