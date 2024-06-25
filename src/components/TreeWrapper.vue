<template>
    <div
      class="competency-tree__dropdown"
      :class="{ 'competency-tree__dropdown--disabled': disabled }"
      v-click-outside="onClickOutside"
      @click="openInput"
    >
      <slot />
    </div>
  </template>
  
  <script setup lang="ts">
  
  const props = defineProps<{disabled?: boolean}>();
  
  const emits = defineEmits(['clickOutside', 'openInput']);
  
  const onClickOutside = () => {
    emits('clickOutside');
  };
  
  const openInput = () => {
    if (!props.disabled) {
      emits('openInput');
    }
  };
  </script>