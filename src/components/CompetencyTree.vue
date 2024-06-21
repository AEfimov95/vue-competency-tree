<template>
  <div
    class="competency-tree__dropdown"
    :class="{ 'competency-tree__dropdown--disabled': isDisabled }"
    v-click-outside="onClickOutside"
    @click="openInput"
  >
    <div
      v-if="!isShowElements"
      class="competency-tree__text"
      :class="{ 'competency-tree__text--disabled': isDisabled }"
    >
      {{
        selectedValue && !isDisabled
          ? selectedValue
          : props.allLevelsPlaceholder
      }}
    </div>
    <input
      v-else
      :placeholder="props.searchInputPlaceholder"
      class="competency-tree__input"
      :class="{ 'competency-tree__input--disabled': isDisabled }"
      v-model="inputValue"
      :disabled="isDisabled"
      ref="inputRef"
    />
    <CloseIcon
      v-if="!isDisabled && inputValue"
      @click="clearInput"
      class="competency-tree__icon"
    />
    <SearchIcon v-else-if="isShowElements" />
    <ChevronIcon
      v-else
      class="competency-tree__icon"
      :class="{ 'competency-tree__icon--disabled': isDisabled }"
    />
    <div
      v-show="isShowElements"
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
          v-for="(item, id) in tempData"
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
import { computed, ref, watch, watchEffect } from "vue";
import TreeNode from "./TreeNode.vue";
import TheCheckbox from "./TheCheckbox.vue";
import { useGlobalStore } from "../store/globalStore";
import { SearchIcon, CloseIcon, ChevronIcon } from "./icons";
import { type OrganisationStructureResource, getAllIds } from "../utils";

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

const { levelsFilter, updateLevelFilterAll } = useGlobalStore();

const inputRef = ref<HTMLInputElement>();
const inputValue = ref<string>("");
const selectedValue = ref<string>("");
const isShowElements = ref<boolean>(false);
const allFilter = ref<boolean>(true);
const previousList = ref<number[]>([]);
const tempData = computed<OrganisationStructureResource[]>(() => {
  if (inputValue.value) {
    return filterByName(props.treeData, inputValue.value);
  }
  return props.treeData;
});
const isLoaded = computed<boolean>(() => tempData.value.length > 0);
const includesId = computed<number[]>(() => {
  return getAllIds(tempData.value);
});
const isIndeterminate = computed<boolean>(() => {
  const included = includesId.value.filter((el) =>
    levelsFilter.value.includes(el)
  ).length;
  return included > 0 && included < includesId.value.length;
});

const hideElements = (): void => {
  clearInput();
  isShowElements.value = false;
};
const openInput = (): void => {
  if (!props.isDisabled) {
    previousList.value = [...levelsFilter.value];
    isShowElements.value = true;
  }
};
const clearInput = (): void => {
  inputValue.value = "";
  selectedValue.value = "";
  selectedLevels();
};
const onClickOutside = (): void => {
  if (isShowElements.value) {
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
const filterByName = (
  resources: OrganisationStructureResource[],
  input: string
): OrganisationStructureResource[] => {
  const inputLower = input.toLowerCase();

  const filterResource = (
    resource: OrganisationStructureResource
  ): OrganisationStructureResource | null => {
    let nameMatches =
      resource.name?.toLowerCase().includes(inputLower) ?? false;

    if (resource.children) {
      const filteredChildren = resource.children
        .map(filterResource)
        .filter(
          (child): child is OrganisationStructureResource => child !== null
        );
      if (filteredChildren.length > 0) {
        return {
          ...resource,
          children: filteredChildren,
        };
      }
    }
    if (nameMatches) {
      return { ...resource };
    }
    return null;
  };
  return resources
    .map(filterResource)
    .filter(
      (resource): resource is OrganisationStructureResource => resource !== null
    );
};
watch(
  () => inputRef.value,
  () => {
    if (inputRef.value && isShowElements) inputRef.value.focus();
  }
);

watch(
  () => levelsFilter.value,
  () => {
    selectedLevels();
    emits("update:modelValue", levelsFilter.value);
  }
);

watchEffect(() => {
  allFilter.value =
    includesId.value.filter((el) => levelsFilter.value.includes(el)).length > 0;
});
</script>
<style>
:root {
  --tree-checkbox-checked: #27ae60;
  --tree-border: #ebeff5;
  --tree-background: #fff;
  --tree-disabled: #7e899a;
  --tree-menu-shadow: 0px 0px 8px 0px rgba(45, 50, 57, 0.1);
}
.competency-tree__dropdown {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;
  position: relative;
  font-size: 1rem;
  background-color: var(--tree-background);
  border-radius: 4px;
  max-height: 2.5rem;
  box-sizing: border-box;
}

.competency-tree__dropdown--disabled {
  background-color: var(--tree-background);
  border: 1px solid var(--tree-disabled);
  color: var(--tree-disabled);
  cursor: not-allowed;
}

.competency-tree__input {
  width: 100%;
  font-size: 1rem;
  background-color: var(--tree-background);
  cursor: pointer;
  border: 0;
  outline: none;
}

.competency-tree__input--disabled {
  background-color: var(--tree-background);
  color: var(--tree-disabled);
  cursor: not-allowed;
}

.competency-tree__text {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  width: 100%;
}

.competency-tree__text--disabled {
  cursor: not-allowed;
}

.competency-tree__icon {
  min-width: 1.5rem;
  cursor: pointer;
}

.competency-tree__icon--disabled {
  cursor: not-allowed;
}

.competency-tree__menu {
  position: absolute;
  left: 0;
  top: 2.5rem;
  right: 0;
  background-color: var(--tree-background);
  margin-top: 0.25rem;
  box-shadow: var(--tree-menu-shadow);
  z-index: 300;
  overflow-y: auto;
  border-radius: 4px;
  border: 1px solid var(--tree-background);
  padding: 8px 0;
}

.competency-tree__menu-nodata {
  text-align: left;
  padding: 8px 16px;
}
.competency-tree__menu-checkbox-all {
  padding: 8px 16px;
}
</style>
