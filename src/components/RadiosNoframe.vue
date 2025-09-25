<template>
  <div class="container">
    <!-- 横向按钮组 -->
    <div class="section">
      <div class="section-title">横向按钮组</div>
      <div class="radio-group horizontal">
        <label
          v-for="song in songs"
          :key="song.value"
          :class="['radio-button', { checked: value === song.value, disabled: isDisabled(song) }]"
        >
          <input
            type="radio"
            :value="song.value"
            v-model="value"
            :disabled="isDisabled(song)"
          />
          {{ song.label }}
        </label>
      </div>
    </div>

    <!-- 纵向按钮组 -->
    <div class="section">
      <div class="section-title">纵向按钮组</div>
      <div class="radio-group vertical">
        <label
          v-for="song in songs"
          :key="song.value + '-vertical'"
          :class="['radio-vertical', { checked: value === song.value, disabled: isDisabled(song) }]"
        >
          <input
            type="radio"
            :value="song.value"
            v-model="value"
            :disabled="isDisabled(song)"
          />
          {{ song.label }}
        </label>
      </div>
    </div>

    <!-- 控制区 -->
    <div class="section">
      <div class="section-title">控制区</div>
      <div class="checkbox-group">
        <label class="checkbox">
          <input type="checkbox" v-model="disabled2" />
          禁用 Shakermaker
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="disabled1" />
          禁用 Live Forever
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const value = ref(null);
const disabled1 = ref(false);
const disabled2 = ref(false);

const songs = [
  { value: "rock'n'roll star", label: "Rock'n'Roll Star" },
  { value: "shakermaker", label: "Shakermaker" },
  { value: "live forever", label: "Live Forever" },
  { value: "up in the sky", label: "Up in the Sky" },
  { value: "...", label: "..." }
];

const isDisabled = (song) => {
  return (song.label === "Live Forever" && disabled1.value) || 
         (song.label === "Shakermaker" && disabled2.value);
};
</script>

<style scoped>
/* 容器和分组间距 */
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #ffd700;
}

/* 横向按钮组 */
.radio-group.horizontal {
  display: flex;
  gap: 12px;
}

.radio-button {
  padding: 6px 12px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #222;
  color: #ffd700;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
}
.radio-button input {
  display: none;
}
.radio-button.checked {
  background: #ffd700;
  color: #222;
  border-color: #ffd700;
}
.radio-button.disabled {
  background: #333;
  color: #888;
  border-color: #555;
  cursor: not-allowed;
}

/* 纵向按钮组 */
.radio-group.vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.radio-vertical {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #222;
  color: #ffd700;
  cursor: pointer;
  transition: 0.2s;
}
.radio-vertical input {
  accent-color: #ffd700;
}
.radio-vertical.checked {
  background: #ffd700;
  color: #222;
}
.radio-vertical.disabled {
  background: #333;
  color: #888;
  cursor: not-allowed;
}

/* 复选框 */
.checkbox-group {
  display: flex;
  gap: 16px;
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #ffd700;
}
.checkbox input {
  accent-color: #ffd700;
}
.checkbox input:disabled {
  cursor: not-allowed;
  color: #888;
}
</style>
