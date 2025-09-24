<template>
  <div class="row">
    <div class="col-2">
      <button class="btn btn-secondary button" @click="sort">
        To original order
      </button>
    </div>
    <div class="col-6">
      <h3>Transition（竖版）</h3>
      <draggable
        class="list-group"
        tag="ul"
        v-model="list"
        v-bind="dragOptions"
      >
        <template #item="{ element }">
          <li class="list-group-item" :key="element.order">
            {{ element.name }}
          </li>
        </template>
      </draggable>

      <h3 style="margin-top:2em;">Transition（横向）</h3>
      <draggable
        class="list-group horizontal-list"
        tag="ul"
        v-model="horizontalList"
        v-bind="dragOptions"
        :direction="'horizontal'"
      >
        <template #item="{ element }">
          <li class="list-group-item" :key="element.order">
            {{ element.name }}
          </li>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import { ref } from "vue";

const message = [
  "vue.draggable",
  "draggable",
  "component",
  "for",
  "vue.js 2.0",
  "based",
  "on",
  "Sortablejs"
];

const list = ref(message.map((name, index) => ({
  name,
  order: index + 1
})));

const horizontalList = ref([
  { name: "水平一", order: 1 },
  { name: "水平二", order: 2 },
  { name: "水平三", order: 3 },
  { name: "水平四", order: 4 }
]);

function sort() {
  list.value = list.value.slice().sort((a, b) => a.order - b.order);
  horizontalList.value = horizontalList.value.slice().sort((a, b) => a.order - b.order);
}

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
};
</script>

<style>
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.horizontal-list {
  flex-direction: row;
  flex-wrap: wrap;
}

.list-group-item {
  cursor: move;
  background: #fff;
  color: #222;
  border: 1px solid #d1d5db;
  margin-bottom: 4px;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  transition: background 0.2s, color 0.2s;
  margin-right: 8px;
}

.list-group-item i {
  cursor: pointer;
}

/* 暗模式适配 */
@media (prefers-color-scheme: dark) {
  .list-group-item {
    background: #333;
    color: #ffd700;
    border-color: #555;
  }
  .ghost {
    background: #444;
  }
  .row, .col-2, .col-6 {
    background: #222;
    color: #fff;
  }
  h3 {
    color: #ffd700;
  }
  .btn-secondary {
    background: #444;
    color: #ffd700;
    border-color: #888;
  }
}
</style>