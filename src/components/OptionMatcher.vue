<template>
  <div class="fill-in-the-blanks">
    <h2>请选择选项填入空位：</h2>
    
    <div class="question-blanks">
      <div
        v-for="(blank, index) in blanks"
        :key="index"
        class="blank-slot"
        @click="clearBlank(index)"
        :class="{ clickable: blank }"
        title="点击可重置该空"
      >
        <transition name="fade-in-up">
          <span v-if="blank" class="blank-text">{{ blank }}</span>
          <span v-else class="placeholder"></span>
        </transition>
      </div>
    </div>
    
    <div class="options-container">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="option-button"
        :class="{ 'is-selected': isSelected(option) }"
        :disabled="isSelected(option)"
        @click="fillBlank(option)"
      >
        {{ option }}
      </button>
    </div>
    
    <button v-if="blanks.some(b => b)" @click="resetBlanks" class="reset-button">
      重置
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const options = ref(['选项A', '选项B']);
const blanks = ref(['', '']);

const isSelected = (option) => {
  return blanks.value.includes(option);
};

const fillBlank = (option) => {
  const nextEmptyIndex = blanks.value.findIndex(blank => blank === '');
  if (nextEmptyIndex !== -1) {
    blanks.value[nextEmptyIndex] = option;
  }
};

const resetBlanks = () => {
  blanks.value = ['', ''];
};

const clearBlank = (index) => {
  blanks.value[index] = '';
};
</script>

<style scoped>
.fill-in-the-blanks {
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}

.question-blanks {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.blank-slot {
  width: 120px;
  height: 40px;
  border-bottom: 2px solid #333;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.placeholder {
  font-size: 14px;
  color: #aaa;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
}

.blank-text {
  font-weight: bold;
  color: #3b82f6;
}

.options-container {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.option-button {
  padding: 10px 20px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  background-color: #fff;
  color: #3b82f6;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.option-button:hover:not(:disabled) {
  background-color: #3b82f6;
  color: #fff;
}

.option-button.is-selected {
  background-color: #f0f4f8;
  color: #9ca3af;
  border-color: #d1d5db;
  cursor: not-allowed;
  transform: scale(0.95);
  opacity: 0.6;
}

.reset-button {
  margin-top: 20px;
  padding: 8px 16px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 4px;
  cursor: pointer;
}

.blank-slot.clickable {
  cursor: pointer;
  box-shadow: 0 0 0 2px #3b82f633;
}

.blank-slot.clickable:hover {
  background: #f0f4f8;
}

/* 动画效果 */
.fade-in-up-enter-active {
  transition: all 0.5s ease-out;
}

.fade-in-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@media (prefers-color-scheme: dark) {
  .fill-in-the-blanks {
    background: #222;
    color: #ffd700;
  }
  .blank-slot {
    border-bottom: 2px solid #ffd700;
  }
  .blank-text {
    color: #ffd700;
  }
  .option-button {
    background-color: #333;
    color: #ffd700;
    border-color: #ffd700;
  }
  .option-button:hover:not(:disabled) {
    background-color: #ffd700;
    color: #222;
  }
  .option-button.is-selected {
    background-color: #444;
    color: #888;
    border-color: #888;
  }
  .reset-button {
    background-color: #333;
    color: #ffd700;
    border-color: #ffd700;
  }
  .placeholder {
    color: #888;
  }
  .blank-slot.clickable:hover {
    background: #333;
  }
}
</style>