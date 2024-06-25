<template>
    <div
      class="competency-tree__dropdown"
      :class="{ 'competency-tree__dropdown--disabled': isDisabled }"
      v-click-outside="onClickOutside"
      @click="openInput"
    >
      <slot />
    </div>
  </template>
  
  <script setup lang="ts">
  
  const props = defineProps({
    isDisabled: Boolean
  });
  
  const emits = defineEmits(['clickOutside', 'openInput']);
  
  const onClickOutside = () => {
    emits('clickOutside');
  };
  
  const openInput = () => {
    if (!props.isDisabled) {
      emits('openInput');
    }
  };
  </script>