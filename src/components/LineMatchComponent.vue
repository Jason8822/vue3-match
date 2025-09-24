<template>
<div id="app">
  <header class="app-header">
    <h1>Vue3 连线匹配游戏演示</h1>
    <p>一个基于Vue3的交互式连线匹配组件</p>
  </header>

  <main class="main-content">
    <!-- 连线匹配组件 -->
    <div class="line-match-container">
      <div class="header">
        <h2 class="title">连线匹配游戏</h2>
        <p class="subtitle">将左侧的中文词汇与右侧的英文单词连线匹配</p>
        <button
          @click="clearAll"
          class="clear-btn"
        >
          清空连线
        </button>
      </div>
      
      <div 
        ref="containerRef"
        class="game-container"
      >
        <!-- 左侧选项 -->
        <div class="left-column">
          <div
            v-for="item in leftItems"
            :key="item.id"
            :class="[
              'item-box left-item',
              { 
                'connected': isConnected(item.id, 'start'),
                'dragging': isDragging 
              }
            ]"
            @mousedown="handleMouseDown($event, item.id)"
            @mouseenter="hoveredItem = item.id"
            @mouseleave="hoveredItem = null"
          >
            {{ item.text }}
          </div>
        </div>

        <!-- 右侧选项 -->
        <div class="right-column">
          <div
            v-for="item in rightItems"
            :key="item.id"
            :data-right-item="item.id"
            :class="[
              'item-box right-item',
              { 
                'connected': isConnected(item.id, 'end'),
                'dragging': isDragging 
              }
            ]"
            @mouseenter="hoveredItem = item.id"
            @mouseleave="hoveredItem = null"
          >
            {{ item.text }}
          </div>
        </div>

        <!-- SVG 连线层 -->
        <svg class="lines-layer">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#10B981"
              />
            </marker>
          </defs>
          
          <!-- 已完成的连线 -->
          <g v-for="(line, index) in lines" :key="index">
            <line
              :x1="line.x1"
              :y1="line.y1"
              :x2="line.x2"
              :y2="line.y2"
              stroke="#10B981"
              stroke-width="3"
              marker-end="url(#arrowhead)"
              class="completed-line"
            />
          </g>
          
          <!-- 当前拖拽的连线 -->
          <line
            v-if="currentLine"
            :x1="currentLine.x1"
            :y1="currentLine.y1"
            :x2="currentLine.x2"
            :y2="currentLine.y2"
            stroke="#6366F1"
            stroke-width="2"
            stroke-dasharray="5,5"
            opacity="0.7"
          />
        </svg>

        <!-- 提示文字 -->
        <div v-if="lines.length === 0 && !isDragging" class="hint">
          <div class="hint-icon">🎯</div>
          <div class="hint-text">点击并拖拽左侧选项到右侧进行连线</div>
        </div>
        
        <!-- 完成提示 -->
        <div v-if="lines.length === 3" class="success-hint">
          🎉 全部连线完成！
        </div>
      </div>
      
      <!-- 得分显示 -->
      <div class="score">
        <span class="score-text">
          已完成: {{ lines.length }} / {{ leftItems.length }}
        </span>
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div class="controls">
      <button @click="resetGame" class="control-btn reset-btn">
        🔄 重置游戏
      </button>
      <button @click="getGameState" class="control-btn info-btn">
        📊 查看状态
      </button>
      <button @click="showInstructions = !showInstructions" class="control-btn help-btn">
        {{ showInstructions ? '隐藏说明' : '📖 显示说明' }}
      </button>
    </div>

    <!-- 游戏说明 -->
    <div v-if="showInstructions" class="instructions">
      <h3>游戏说明：</h3>
      <ul>
        <li>🖱️ 点击并拖拽左侧的中文词汇到右侧对应的英文单词</li>
        <li>✅ 正确连线后，选项会变成绿色表示已完成</li>
        <li>❌ 点击连线中间的红色圆圈可以删除该连线</li>
        <li>🎯 完成所有连线即可通关</li>
        <li>🔄 使用"清空连线"按钮可以重新开始</li>
      </ul>
    </div>

    <!-- 游戏统计 -->
    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">连线总数:</span>
        <span class="stat-value">{{ gameStats.totalLines }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">完成度:</span>
        <span class="stat-value">{{ gameStats.completionRate }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">游戏状态:</span>
        <span class="stat-value">{{ gameStats.status }}</span>
      </div>
    </div>
  </main>

  <footer class="app-footer">
    <p>&copy; 2024 Vue3 连线匹配游戏 | 基于 Composition API 构建</p>
  </footer>
</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 响应式数据
const containerRef = ref(null)
const hoveredItem = ref(null)
const isDragging = ref(false)
const currentLine = ref(null)
const showInstructions = ref(false)
const gameHistory = reactive([])

const leftItems = reactive([
{ id: 'L1', text: '苹果' },
{ id: 'L2', text: '香蕉' },
{ id: 'L3', text: '橙子' }
])

const rightItems = reactive([
{ id: 'R1', text: 'Apple' },
{ id: 'R2', text: 'Orange' },
{ id: 'R3', text: 'Banana' }
])

const lines = reactive([])

// 计算属性
const isConnected = computed(() => {
return (itemId, type) => {
  if (type === 'start') {
    return lines.some(line => line.startId === itemId)
  } else {
    return lines.some(line => line.endId === itemId)
  }
}
})

// 游戏统计
const gameStats = computed(() => {
return {
  totalLines: lines.length,
  completionRate: Math.round((lines.length / leftItems.length) * 100),
  status: lines.length === leftItems.length ? '已完成' : '进行中'
}
})

// 方法
const getElementCenter = (element) => {
if (!element || !containerRef.value) return { x: 0, y: 0 }

const containerRect = containerRef.value.getBoundingClientRect()
const elementRect = element.getBoundingClientRect()

return {
  x: elementRect.left + elementRect.width / 2 - containerRect.left,
  y: elementRect.top + elementRect.height / 2 - containerRect.top
}
}

const getElementEdge = (element, side = 'right') => {
  if (!element || !containerRef.value) return { x: 0, y: 0 }
  const containerRect = containerRef.value.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()
  const y = elementRect.top + elementRect.height / 2 - containerRect.top
  let x
  if (side === 'right') {
    x = elementRect.right - containerRect.left
  } else {
    x = elementRect.left - containerRect.left
  }
  return { x, y }
}

const handleMouseDown = (e, itemId) => {
  e.preventDefault()
  isDragging.value = true

  const element = e.currentTarget
  const start = getElementEdge(element, 'right')

  currentLine.value = {
    startId: itemId,
    x1: start.x,
    y1: start.y,
    x2: start.x,
    y2: start.y
  }

  const handleMouseMove = (moveEvent) => {
    if (!containerRef.value || !currentLine.value) return
    const containerRect = containerRef.value.getBoundingClientRect()
    const x = moveEvent.clientX - containerRect.left
    const y = moveEvent.clientY - containerRect.top
    currentLine.value.x2 = x
    currentLine.value.y2 = y
  }

  const handleMouseUp = (upEvent) => {
    isDragging.value = false
    const targetElement = document.elementFromPoint(upEvent.clientX, upEvent.clientY)
    const rightItemElement = targetElement?.closest('[data-right-item]')
    if (rightItemElement) {
      const targetId = rightItemElement.getAttribute('data-right-item')
      const start = getElementEdge(element, 'right')
      const end = getElementEdge(rightItemElement, 'left')
      const existingLineIndex = lines.findIndex(line =>
        line.startId === itemId || line.endId === targetId
      )
      const newLine = {
        startId: itemId,
        endId: targetId,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y
      }
      if (existingLineIndex !== -1) {
        lines[existingLineIndex] = newLine
      } else {
        lines.push(newLine)
        gameHistory.push({
          action: 'add',
          time: new Date(),
          data: newLine
        })
        if (lines.length === leftItems.length) {
          setTimeout(() => {
            alert('🎉 恭喜！你已经完成所有连线！')
          }, 100)
        }
      }
    }
    currentLine.value = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const removeLine = (index) => {
const removedLine = lines[index]
lines.splice(index, 1)
gameHistory.push({
  action: 'remove',
  time: new Date(),
  data: removedLine
})
}

const clearAll = () => {
lines.splice(0, lines.length)
gameHistory.splice(0, gameHistory.length)
}

// 事件处理方法
const resetGame = () => {
clearAll()
console.log('游戏已重置')
}

const getGameState = () => {
console.log('当前游戏状态:', {
  lines: [...lines],
  history: [...gameHistory],
  stats: gameStats.value
})
alert(`当前已完成 ${lines.length}/${leftItems.length} 条连线\n完成度: ${gameStats.value.completionRate}%`)
}

// 生命周期
onMounted(() => {
console.log('App 组件已挂载')
})
</script>

<style scoped>
#app {
min-height: 100vh;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-header {
text-align: center;
padding: 2rem;
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
color: white;
}

.app-header h1 {
font-size: 2.5rem;
margin-bottom: 0.5rem;
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.app-header p {
font-size: 1.125rem;
opacity: 0.9;
}

.main-content {
padding: 2rem;
max-width: 1200px;
margin: 0 auto;
}

.line-match-container {
width: 100%;
max-width: 1024px;
margin: 0 auto;
padding: 1.5rem;
background: linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%);
border-radius: 0.75rem;
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.header {
text-align: center;
margin-bottom: 1.5rem;
}

.title {
font-size: 1.5rem;
font-weight: bold;
color: #1f2937;
margin-bottom: 0.5rem;
}

.subtitle {
color: #6b7280;
margin-bottom: 0.5rem;
}

.clear-btn {
margin-top: 0.5rem;
padding: 0.5rem 1rem;
background-color: #ef4444;
color: white;
border: none;
border-radius: 0.5rem;
cursor: pointer;
transition: background-color 0.2s;
}

.clear-btn:hover {
background-color: #dc2626;
}

.game-container {
position: relative;
width: 100%;
height: 24rem;
background-color: white;
border-radius: 0.5rem;
box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
border: 2px dashed #d1d5db;
}

.left-column, .right-column {
position: absolute;
top: 0;
height: 100%;
display: flex;
flex-direction: column;
justify-content: space-around;
}

.left-column {
left: 2rem;
}

.right-column {
right: 2rem;
}

.item-box {
width: 6rem;
height: 3rem;
border: 2px solid;
border-radius: 0.5rem;
display: flex;
align-items: center;
justify-content: center;
font-weight: 500;
transition: all 0.2s;
user-select: none;
}

.left-item {
border-color: #3b82f6;
background-color: #dbeafe;
color: #1d4ed8;
cursor: pointer;
}

.left-item:hover {
background-color: #bfdbfe;
}

.left-item.dragging:hover {
transform: scale(1.05);
}

.left-item.connected {
border-color: #10b981;
background-color: #d1fae5;
color: #047857;
}

.right-item {
border-color: #8b5cf6;
background-color: #ede9fe;
color: #6d28d9;
}

.right-item.dragging:hover {
transform: scale(1.05);
background-color: #ddd6fe;
}

.right-item.connected {
border-color: #10b981;
background-color: #d1fae5;
color: #047857;
}

.lines-layer {
position: absolute;
inset: 0;
width: 100%;
height: 100%;
pointer-events: none;
}

.completed-line {
filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.delete-btn {
cursor: pointer;
pointer-events: auto;
transition: transform 0.1s;
}

.delete-btn:hover {
transform: scale(1.1);
}

.delete-text {
pointer-events: none;
font-weight: bold;
}

.hint {
position: absolute;
inset: 0;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
pointer-events: none;
color: #9ca3af;
text-align: center;
}

.hint-icon {
font-size: 1.125rem;
margin-bottom: 0.5rem;
}

.success-hint {
position: absolute;
top: 1rem;
left: 50%;
transform: translateX(-50%);
background-color: #10b981;
color: white;
padding: 0.5rem 1rem;
border-radius: 0.5rem;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
0%, 100% {
  opacity: 1;
}
50% {
  opacity: .5;
}
}

.score {
margin-top: 1rem;
text-align: center;
}

.score-text {
font-size: 1.125rem;
font-weight: 600;
color: #374151;
}

.controls {
display: flex;
justify-content: center;
gap: 1rem;
margin: 2rem 0;
flex-wrap: wrap;
}

.control-btn {
padding: 0.75rem 1.5rem;
border: none;
border-radius: 0.5rem;
font-size: 1rem;
font-weight: 500;
cursor: pointer;
transition: all 0.2s;
color: white;
}

.reset-btn {
background-color: #10b981;
}

.reset-btn:hover {
background-color: #059669;
transform: translateY(-1px);
}

.info-btn {
background-color: #3b82f6;
}

.info-btn:hover {
background-color: #2563eb;
transform: translateY(-1px);
}

.help-btn {
background-color: #f59e0b;
}

.help-btn:hover {
background-color: #d97706;
transform: translateY(-1px);
}

.instructions {
background: rgba(255, 255, 255, 0.95);
padding: 1.5rem;
border-radius: 0.75rem;
margin: 1.5rem 0;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.instructions h3 {
color: #374151;
margin-bottom: 1rem;
}

.instructions ul {
list-style: none;
padding: 0;
}

.instructions li {
padding: 0.5rem 0;
color: #4b5563;
border-bottom: 1px solid #e5e7eb;
}

.instructions li:last-child {
border-bottom: none;
}

.stats {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1rem;
margin: 1.5rem 0;
}

.stat-item {
background: rgba(255, 255, 255, 0.9);
padding: 1rem;
border-radius: 0.5rem;
text-align: center;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
display: block;
color: #6b7280;
font-size: 0.875rem;
margin-bottom: 0.25rem;
}

.stat-value {
display: block;
color: #111827;
font-size: 1.25rem;
font-weight: bold;
}

.app-footer {
text-align: center;
padding: 1.5rem;
background: rgba(0, 0, 0, 0.2);
color: rgba(255, 255, 255, 0.8);
margin-top: 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
.app-header h1 {
  font-size: 2rem;
}

.main-content {
  padding: 1rem;
}

.controls {
  flex-direction: column;
  align-items: center;
}

.control-btn {
  width: 100%;
  max-width: 300px;
}

.stats {
  grid-template-columns: 1fr;
}
}
</style>