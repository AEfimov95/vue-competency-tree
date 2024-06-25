<template>
  <div
    v-if="!hasElements"
    class="competency-tree__text"
    :class="{ 'competency-tree__text--disabled': disabled }"
  >
    {{ displayText }}
  </div>
  <TheInput
    v-else
    :disabled="disabled"
    :placeholder="searchInputPlaceholder || ''"
    v-model="inputValue"
  />
  <div
    @click="clearInput"
    class="competency-tree__icon"
    :class="{ 'competency-tree__icon--disabled': disabled }"
  >
    <Component :is="currentIcon" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import TheInput from "./TheInput.vue";
import { SearchIcon, CloseIcon, ChevronIcon } from "./icons";

const props = defineProps<{
  disabled?: boolean;
  hasElements: boolean;
  selectedValue: string;
  allLevelsPlaceholder: string;
  searchInputPlaceholder: string;
  modelValue: string;
}>();

const emits = defineEmits(["clearInput", "update:modelValue"]);

const inputValue = ref("");

const displayText = computed(() => {
  return props.selectedValue && !props.disabled
    ? props.selectedValue
    : props.allLevelsPlaceholder;
});

const currentIcon = computed(() => {
  if (!props.disabled && inputValue.value) return CloseIcon;
  if (props.hasElements) return SearchIcon;
  return ChevronIcon;
});

const clearInput = () => {
  if (!props.disabled && inputValue.value) {
    inputValue.value = "";
    emits("clearInput");
  }
};
watch(
  () => {
    inputValue.value;
  },
  () => {
    emits("update:modelValue", inputValue.value);
  },
  { deep: true }
);
</script>
