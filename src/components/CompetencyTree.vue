<template>
  <div
    class="competency-tree__dropdown"
    :class="{ 'competency-tree__dropdown--disabled': isDisabled }"
    v-click-outside="onClickOutside"
    @click="openInput"
  >
    <div
      v-if="!hasElements"
      class="competency-tree__text"
      :class="{ 'competency-tree__text--disabled': isDisabled }"
    >
      {{
        selectedValue && !isDisabled
          ? selectedValue
          : props.allLevelsPlaceholder
      }}
    </div>
    <TheInput
      v-else
      :disabled="isDisabled"
      :placeholder="searchInputPlaceholder"
      v-model="inputValue"
    />
    <Component
      @click="clearInput"
      :is="currentIcon"
      :class="{ 'competency-tree__icon--disabled': isDisabled }"
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
  </div>
</template>

<script setup lang="ts">
import { computed, type Ref, ref, watch, watchEffect } from "vue";
import TreeNode from "./TreeNode.vue";
import TheCheckbox from "./TheCheckbox.vue";
import { SearchIcon, CloseIcon, ChevronIcon } from "./icons";
import { type OrganisationStructureResource, getAllIds, filterByName } from "../utils";
import { provide } from "vue";
import TheInput from "./TheInput.vue";
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
export interface FilterContext {
  levelsFilter: Ref<number[]>;
  updateLevelFilter: (id: number, flag: boolean) => void;
  updateLevelFilterAll: (ids: number[], flag: boolean) => void;
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
const levelsFilter = ref<number[]>([]);
const inputValue = ref<string>("");
const selectedValue = ref<string>("");
const hasElements = ref<boolean>(false);
const allFilter = ref<boolean>(true);
const previousList = ref<number[]>([]);
const TreeElements = computed<OrganisationStructureResource[]>(() => {
  if (inputValue.value) {
    return filterByName(props.treeData, inputValue.value);
  }
  return props.treeData;
});
const isLoaded = computed<boolean>(() => TreeElements.value.length > 0);
const includesId = computed<number[]>(() => {
  return getAllIds(TreeElements.value);
});
const isIndeterminate = computed<boolean>(() => {
  const included = includesId.value.filter((el) =>
    levelsFilter.value.includes(el)
  ).length;
  return included > 0 && included < includesId.value.length;
});
const currentIcon = computed(() => {
  if (!props.isDisabled && inputValue.value) return CloseIcon;
  if (hasElements.value) return SearchIcon;
  return ChevronIcon;
});

const hideElements = (): void => {
  clearInput();
  hasElements.value = false;
};
const openInput = (): void => {
  if (!props.isDisabled) {
    previousList.value = [...levelsFilter.value];
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

const selectedLevels = (): void => {
  const names: string[] = [];
  if (getAllIds(props.treeData).length === levelsFilter.value.length) {
    names.push(props.allLevelsPlaceholder);
  } else {
    selectedLevelsSearch(props.treeData, names);
  }
  selectedValue.value = names.join(", ");
};

const updateLevelFilter = (id: number, flag: boolean) => {
  const updatedFilter = new Set(levelsFilter.value);
  if (updatedFilter.has(id)) {
    if (!flag) {
      updatedFilter.delete(id);
    }
  } else {
    if (flag) {
      updatedFilter.add(id);
    }
  }
  levelsFilter.value = Array.from(updatedFilter);
};

const updateLevelFilterAll = (ids: number[], flag: boolean) => {
  const filterSet = new Set(levelsFilter.value);
  ids.forEach((number) => {
    if (filterSet.has(number)) {
      if (!flag) {
        filterSet.delete(number);
      }
    } else {
      if (flag) {
        filterSet.add(number);
      }
    }
  });
  levelsFilter.value = Array.from(filterSet);
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
