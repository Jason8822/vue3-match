<template>
<div class="match-container">
  <h3>拖拽匹配示例</h3>

  <!-- 可拖拽选项区 -->
  <div class="choices">
    <div
      v-for="item in choices"
      :key="item.id"
      class="choice"
      draggable="true"
      @dragstart="onDragStart($event, item.id)"
      :aria-grabbed="isPlaced(item.id) ? 'true' : 'false'"
    >
      {{ item.label }}
    </div>
  </div>

  <!-- 目标放置区 -->
  <div class="targets">
    <div
      v-for="target in targets"
      :key="target.id"
      class="target"
      @dragover.prevent="onDragOver"
      @drop="onDrop($event, target.id)"
    >
      <div class="target-title">{{ target.title }}</div>

      <div class="slot" :class="{ filled: placements[target.id] }">
        <template v-if="placements[target.id]">
          <!-- 显示被放入的选择项 -->
          <div class="placed" @click="removeFromTarget(target.id)">
            {{ getChoiceLabel(placements[target.id]) }}
          </div>
        </template>

        <template v-else>
          <div class="hint">把选项拖到这里</div>
        </template>
      </div>
    </div>
  </div>

  <!-- 操作按钮 -->
  <div class="controls">
    <button @click="checkAnswers">检查答案</button>
    <button @click="resetAll">重置</button>
    <div v-if="resultMessage" class="result">{{ resultMessage }}</div>
  </div>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue'

/*
简单数据结构：
choices: 可拖拽项（id, label）
targets: 放置目标（id, title, correctId）
placements: { [targetId]: choiceId } 表示哪个 choice 放在哪个 target
*/
const choices = reactive([
{ id: 'c1', label: 'big' },
{ id: 'c2', label: 'large' }
])

// 两个目标，分别期望的正确 choice id 存在 correctId 中
const targets = reactive([
{ id: 't1', title: '同义词 A', correctId: 'c2' }, // large
{ id: 't2', title: '同义词 B', correctId: 'c1' }  // big
])

// placements: targetId -> choiceId (null 表示空)
const placements = reactive({
t1: null,
t2: null
})

const resultMessage = ref('')

// drag start: 设置被拖动项 id
function onDragStart(e, choiceId) {
e.dataTransfer?.setData('text/plain', choiceId)
// 可视化拖动效果（可选）
e.dataTransfer.effectAllowed = 'move'
}

// drag over: 必须阻止默认以允许 drop
function onDragOver(e) {
e.preventDefault()
}

// drop 处理：将 choice 放到 target，并从原先 target 清除（避免重复放到多个 target）
function onDrop(e, targetId) {
e.preventDefault()
const choiceId = e.dataTransfer?.getData('text/plain')
if (!choiceId) return

// 如果这个 choice 已经在别的 target 上，先把它移除
for (const tid of Object.keys(placements)) {
  if (placements[tid] === choiceId) {
    placements[tid] = null
    break
  }
}

// 如果目标处已有 item，则把原有 item放回 choices 区（或互换）
// 这里我们支持互换：如果目标已有 item，先把它取出，放回 choices 区（实际上 choices 是常驻，不需要物理移回）
// 简单实现：直接覆盖目标（因为 choices 显示是常驻），并确保一个 choice 只在一个 target 上
placements[targetId] = choiceId

// 清空检查提示
resultMessage.value = ''
}

// 获取 choice 的 label（用于显示放入的项）
function getChoiceLabel(choiceId) {
const c = choices.find(x => x.id === choiceId)
return c ? c.label : ''
}

// 判断某个 choice 是否已经被放到任一 target
function isPlaced(choiceId) {
return Object.values(placements).includes(choiceId)
}

// 移除某个 target 的放置项（例如点击移出）
function removeFromTarget(targetId) {
placements[targetId] = null
resultMessage.value = ''
}

// 检查所有 target 是否与 correctId 匹配
function checkAnswers() {
const wrong = targets.filter(t => placements[t.id] !== t.correctId)
if (wrong.length === 0 && targets.length === Object.keys(placements).length) {
  resultMessage.value = '全部正确 🎉'
} else {
  resultMessage.value = `有 ${wrong.length} 项不正确`
}
}

// 重置
function resetAll() {
for (const k of Object.keys(placements)) placements[k] = null
resultMessage.value = ''
}
</script>

<style scoped>
.match-container {
max-width: 760px;
margin: 12px auto;
font-family: Arial, "Noto Sans", sans-serif;
}

.choices {
display: flex;
gap: 12px;
margin-bottom: 18px;
}

.choice {
padding: 10px 14px;
background: #f3f4f6;
border: 1px solid #d1d5db;
border-radius: 8px;
cursor: grab;
user-select: none;
}

.targets {
display: flex;
gap: 16px;
}

.target {
width: 45%;
border: 1px dashed #cbd5e1;
padding: 12px;
border-radius: 8px;
background: #fff;
}

.target-title { font-weight: 600; margin-bottom: 8px; }

.slot {
min-height: 56px;
display:flex;
align-items:center;
justify-content:center;
background: #fbfdff;
border-radius: 6px;
}

.slot.filled { background: #eef2ff; border: 1px solid #c7d2fe; }

.placed {
padding: 8px 12px;
background: #eef2ff;
border-radius: 6px;
cursor: pointer;
}

.hint { color:#94a3b8 }

.controls { margin-top: 16px; display:flex; gap: 10px; align-items:center; }
.result { margin-left: 8px; font-weight:600; }
</style>
