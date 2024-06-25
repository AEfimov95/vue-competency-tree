<template>
  <div
    v-if="!hasElements"
    class="competency-tree__text"
    :class="{ 'competency-tree__text--disabled': isDisabled }"
  >
    {{ displayText }}
  </div>
  <TheInput
    v-else
    :disabled="isDisabled"
    :placeholder="searchInputPlaceholder || ''"
    v-model="inputValue"
  />
  <Component
    @click="clearInput"
    :is="currentIcon"
    :class="{ 'competency-tree__icon--disabled': isDisabled }"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import TheInput from "./TheInput.vue";
import { SearchIcon, CloseIcon, ChevronIcon } from "./icons";

const props = defineProps({
  isDisabled: Boolean,
  hasElements: Boolean,
  selectedValue: String,
  allLevelsPlaceholder: String,
  searchInputPlaceholder: String,
});

const emits = defineEmits(["clearInput"]);

const inputValue = ref("");

const displayText = computed(() => {
  return props.selectedValue && !props.isDisabled
    ? props.selectedValue
    : props.allLevelsPlaceholder;
});

const currentIcon = computed(() => {
  if (!props.isDisabled && inputValue.value) return CloseIcon;
  if (props.hasElements) return SearchIcon;
  return ChevronIcon;
});

const clearInput = () => {
  if (!props.isDisabled && inputValue.value) {
    inputValue.value = "";
    emits("clearInput");
  }
};
</script>
