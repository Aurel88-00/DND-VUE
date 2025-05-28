<script setup lang="ts">
import { type PropType } from "vue";
import type { Tabs } from "../../lib/types/tabs.type";

defineProps({
  tabs: {
    type: Array as PropType<Tabs[]>,
    required: true,
  },
  activeTab: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["setActiveTab"]);
</script>
<template>
  <div class="tabs-container">
    <div :key="tab.id" v-for="(tab, index) in tabs">
      <button
        :key="tab.id"
        :class="['tabs-button', { active: activeTab === index + 1 }]"
        @click="emit('setActiveTab', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tabs-container {
  width: 100%;
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.tabs-button {
  padding: 14px;
  border: none;
  cursor: pointer;
  min-width: 240px;
  font-size: 15px;
  background-color: #4a90e270;
  color: white;
  border-radius: 10px;
}

.active {
  background-color: #4a90e2;
}
</style>
