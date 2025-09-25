<template>
  <n-space vertical>
    <n-radio-group v-model:value="value" name="radiobuttongroup1">
      <n-radio-button
        v-for="song in songs"
        :key="song.value"
        :value="song.value"
        :disabled="
          (song.label === 'Live Forever' && disabled1)
            || (song.label === 'Shakermaker' && disabled2)
        "
        :label="song.label"
      />
    </n-radio-group>
    <n-space>
      <n-checkbox v-model:checked="disabled2" style="margin-right: 12px">
        禁用 Shakemaker
      </n-checkbox>
      <n-checkbox v-model:checked="disabled1">
        禁用 Live Forever
      </n-checkbox>
    </n-space>
  </n-space>
</template>

<script setup>
import { ref } from "vue";

const value = ref(null);
const disabled2 = ref(false);
const disabled1 = ref(false);
const songs = [
  {
    value: "Rock'n'Roll Star",
    label: "Rock'n'Roll Star"
  },
  {
    value: "Shakermaker",
    label: "Shakermaker"
  },
  {
    value: "Live Forever",
    label: "Live Forever"
  },
  {
    value: "Up in the Sky",
    label: "Up in the Sky"
  },
  {
    value: "...",
    label: "..."
  }
].map((s) => {
  s.value = s.value.toLowerCase();
  return s;
});
</script>

<style>
@media (prefers-color-scheme: dark) {
  /* 普通按钮 */
  .n-radio-button {
    background: #222 !important;
    color: #ffd700 !important;
    border-color: #555 !important;
    transition: background 0.2s, color 0.2s;
  }
  /* hover 效果 */
  .n-radio-button:hover:not(.n-radio-button--checked):not(:disabled) {
    background: #444 !important;
    color: #fffbe6 !important;
    border-color: #ffd700 !important;
  }
  /* 选中效果 */
  .n-radio-button.n-radio-button--checked {
    background: #ffd700 !important;
    color: #222 !important;
    border-color: #ffd700 !important;
  }
  /* 禁用效果 */
  .n-radio-button:disabled,
  .n-radio-button.n-radio-button--disabled {
    background: #333 !important;
    color: #888 !important;
    border-color: #555 !important;
    opacity: 0.7;
  }
  /* checkbox 颜色 */
  .n-checkbox .n-checkbox-box {
    background: #222 !important;
    border-color: #ffd700 !important;
  }
  .n-checkbox .n-checkbox-box--checked {
    background: #ffd700 !important;
    border-color: #ffd700 !important;
  }
  .n-checkbox .n-checkbox-box__check {
    color: #222 !important;
  }
  .n-checkbox .n-checkbox__label {
    color: #ffd700 !important;
  }
}
</style>