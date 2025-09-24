<script setup>
import HelloWorld from './components/HelloWorld.vue';
import MatchPairs from './components/MatchPairs.vue';
import LineMatch from './components/LineMatch.vue';
import LineMatchComponent from './components/LineMatchComponent.vue';
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <MatchPairs />
  <div style="width: 600px; height: 400px; border: 1px solid red">
    <!-- <LineMatch /> -->
    <LineMatchComponent 
    ref="lineMatchRef"
    @match-complete="handleMatchComplete"
    @line-added="handleLineAdded"
    @line-removed="handleLineRemoved"
  />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
button {
  background-color: #222;   /* 深色背景 */
  color: #fff;              /* 白色文字 */
  border: 1px solid #444;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover {
  background-color: #444;
  color: #ffd700;           /* 悬停时高亮文字 */
}
</style>
