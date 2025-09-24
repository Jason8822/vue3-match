<template>
  <div class="match-pairs">
    <!-- 备选池 -->
    <div class="candidates">
      <h3>备选池</h3>
      <div class="candidate-list">
        <div
          v-for="slot in candidateSlots"
          :key="slot.id"
          class="candidate-slot"
          :class="{ highlight: isOverCandidate === slot.id }"
          @dragover.prevent="isOverCandidate = slot.id"
          @dragleave="isOverCandidate = null"
          @drop="onDrop(slot.id, 'candidate')"
        >
          <transition name="fade">
            <div
              v-if="slot.item"
              :key="'item-' + slot.item.id"
              class="candidate"
              draggable="true"
              @dragstart="onDragStart(slot.item.id, 'candidate', slot.id)"
              @dragend="onDragEnd('candidate')"
            >
              {{ slot.item.text }}
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 目标池 -->
    <div class="targets">
      <h3>目标池</h3>
      <div
        v-for="target in state.targets"
        :key="target.id"
        class="target"
        :class="{ highlight: isOverTarget === target.id }"
        @dragover.prevent="isOverTarget = target.id"
        @dragleave="isOverTarget = null"
        @drop="onDrop(target.id, 'target')"
      >
        <transition name="fade">
          <div
            v-if="target.value"
            :key="'placed-' + target.value.id"
            class="placed-item"
            draggable="true"
            @dragstart="onDragStart(target.value.id, 'target', target.id)"
            @dragend="onDragEnd('target')"
          >
            {{ target.value.text }}
          </div>
          <div v-else class="placeholder">拖到这里</div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

// 状态管理
const state = reactive({
  candidates: [
    { id: 1, text: '选项A' },
    { id: 2, text: '选项B' },
  ],
  targets: [
    { id: 1, expectedId: 1, value: null },
    { id: 2, expectedId: 2, value: null },
  ],
});

let draggedItemId = null;
let sourceType = null; // 'candidate' 或 'target'
let sourceSlotId = null;
let sourceTargetId = null;

const isOverTarget = ref(null);
const isOverCandidate = ref(null);

// 备选槽初始化
state.candidatesInit = state.candidates.map((c) => ({ id: c.id }));
const candidateSlots = computed(() =>
  state.candidatesInit.map((init) => ({
    id: init.id,
    item: state.candidates.find((c) => c.id === init.id) || null,
  }))
);

function onDragStart(itemId, type, slotOrTargetId = null) {
  draggedItemId = itemId;
  sourceType = type;
  if (type === 'candidate') sourceSlotId = slotOrTargetId;
  else if (type === 'target') sourceTargetId = slotOrTargetId;
}

// 放到目标池或备选池
function onDrop(targetId, targetType) {
  if (!draggedItemId) return;

  if (targetType === 'target') {
    const target = state.targets.find((t) => t.id === targetId);
    if (!target) return;

    if (sourceType === 'candidate') {
      const index = state.candidates.findIndex((i) => i.id === draggedItemId);
      if (index !== -1) {
        if (target.value) state.candidates.push(target.value);
        target.value = state.candidates[index];
        state.candidates.splice(index, 1);
      }
    } else if (sourceType === 'target') {
      const sourceTarget = state.targets.find((t) => t.id === sourceTargetId);
      if (target.value)
        [target.value, sourceTarget.value] = [sourceTarget.value, target.value];
      else {
        target.value = sourceTarget.value;
        sourceTarget.value = null;
      }
    }
  } else if (targetType === 'candidate' && sourceType === 'target') {
    const sourceTarget = state.targets.find((t) => t.id === sourceTargetId);
    if (sourceTarget.value) {
      state.candidates.push(sourceTarget.value);
      sourceTarget.value = null;
    }
  }

  resetDragState();
}

// 拖拽结束，磁吸最近槽
function onDragEnd(type) {
  if (type === 'candidate' && draggedItemId && sourceSlotId !== null) {
    // 松手时自动对齐回原来的槽或最近目标
    const slot = state.candidatesInit.find((s) => s.id === sourceSlotId);
    if (!state.candidates.find((c) => c.id === draggedItemId)) {
      state.candidates.push(
        state.candidatesInit.find((c) => c.id === draggedItemId) || {
          id: draggedItemId,
          text: '',
        }
      );
    }
  }
  resetDragState();
}

function resetDragState() {
  draggedItemId = null;
  sourceType = null;
  sourceSlotId = null;
  sourceTargetId = null;
  isOverTarget.value = null;
  isOverCandidate.value = null;
}
</script>

<style scoped>
.match-pairs {
  display: flex;
  gap: 40px;
  font-family: Arial, sans-serif;
}

/* 备选池 */
.candidates {
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

.candidate-slot {
  border: 1px dashed #aaa;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.2s;
}

.candidate-slot.highlight {
  background-color: #d0f0ff;
  transform: scale(1.05);
}

.candidate {
  border: 1px solid #333;
  padding: 10px;
  background-color: #f9f9f9;
  width: 100px;
  text-align: center;
  cursor: grab;
  transition: transform 0.2s;
}

.candidate:active {
  transform: scale(1.05);
}

/* 目标池 */
.targets {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.target {
  border: 1px dashed #333;
  padding: 10px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.2s;
}

.target.highlight {
  background-color: #d0f0ff;
  transform: scale(1.05);
}

.placed-item {
  border: 1px solid #333;
  padding: 10px;
  background-color: #fff8c4;
  width: 100px;
  text-align: center;
  cursor: grab;
}

/* placeholder */
.placeholder {
  color: #aaa;
  font-size: 14px;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
