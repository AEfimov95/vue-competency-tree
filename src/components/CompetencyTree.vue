<template>
  <TreeWrapper
    :disabled="isDisabled"
    @clickOutside="onClickOutside"
    @openInput="openInput"
  >
    <TreeInput
      :disabled="isDisabled"
      :hasElements="hasElements"
      :selectedValue="selectedValue"
      :allLevelsPlaceholder="props.allLevelsPlaceholder"
      :searchInputPlaceholder="props.searchInputPlaceholder"
      v-model="inputValue"
      @clearInput="clearInput"
    />
    <div
      v-show="hasElements"
      class="competency-tree__menu"
      :style="`max-height:${props.maxHeight}`"
    >
      <div v-if="isLoaded">
        <TheCheckbox
          class="competency-tree__menu-checkbox-all"
          :model-value="allFilter"
          :label="props.selectAllLabel"
          :is-indeterminate="isIndeterminate"
          @update:model-value="selectAll"
        />
        <TreeNode
          v-for="(item, id) in TreeElements"
          :key="id"
          :data="item"
          :input-search="inputValue"
        />
      </div>
      <div v-else class="competency-tree__menu-nodata">
        {{ props.noResultLabel }}
      </div>
    </div>
  </TreeWrapper>
</template>

<script setup lang="ts">
import { watch, watchEffect, provide } from "vue";
import TreeInput from "./TreeInput.vue";
import TreeWrapper from "./TreeWrapper.vue";
import TreeNode from "./TreeNode.vue";
import TheCheckbox from "./TheCheckbox.vue";
import { useTreeLogic } from "../composables/useTreeLogic";
import { getAllIds } from "../utils";
import type { OrganisationStructureResource, FilterContext } from "../types";

export interface Props {
  isDisabled?: boolean;
  treeData?: OrganisationStructureResource[];
  allLevelsPlaceholder?: string;
  searchInputPlaceholder?: string;
  selectAllLabel?: string;
  noResultLabel?: string;
  maxHeight?: string;
  modelValue?: number[];
}

const emits = defineEmits(["update:modelValue"]);
const props = withDefaults(defineProps<Props>(), {
  treeData: () => [],
  allLevelsPlaceholder: () => "All Levels",
  searchInputPlaceholder: () => "Search",
  selectAllLabel: () => "Select All",
  noResultLabel: () => "No results found",
  maxHeight: () => "60vh",
});

const {
  levelsFilter,
  inputValue,
  selectedValue,
  hasElements,
  allFilter,
  TreeElements,
  isLoaded,
  includesId,
  isIndeterminate,
  selectedLevels,
  updateLevelFilter,
  updateLevelFilterAll,
} = useTreeLogic(props.treeData, props.allLevelsPlaceholder);


const hideElements = (): void => {
  clearInput();
  hasElements.value = false;
};
const openInput = (): void => {
  if (!props.isDisabled) {
    hasElements.value = true;
  }
};
const clearInput = (): void => {
  if (!props.isDisabled && inputValue.value) {
    inputValue.value = "";
    selectedValue.value = "";
    selectedLevels();
  }
};
const onClickOutside = (): void => {
  if (hasElements.value) {
    clearInput()
    hideElements();
  }
};

const selectAll = (value: boolean): void => {
  allFilter.value = value;
  updateLevelFilterAll(includesId.value, value);
};

const selectedLevelsSearch = (
  data: OrganisationStructureResource[],
  names: string[]
): void => {
  data.forEach((item) => {
    if (item.children) {
      const ids = getAllIds(item.children);
      if (ids.every((el) => levelsFilter.value.includes(el))) {
        if (item.name) names.push(item.name);
      } else {
        selectedLevelsSearch(item.children, names);
      }
    } else if (levelsFilter.value.includes(item.id!)) {
      names.push(item.name!);
    }
  });
};

provide("levelsfilter", {
  levelsFilter,
  updateLevelFilter,
  updateLevelFilterAll,
} as FilterContext);

watch(
  () => levelsFilter.value,
  () => {
    selectedLevels();
    emits("update:modelValue", levelsFilter.value);
  }
);

watchEffect(() => {
  allFilter.value = includesId.value.some((el) =>
    levelsFilter.value.includes(el)
  );
});
</script>
