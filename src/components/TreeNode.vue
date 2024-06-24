<template>
  <div class="competency-tree__node">
    <div v-if="data.children && data.children.length > 0">
      <div class="competency-tree__node-header">
        <MiniChevronRightIcon
          @click="isShowOptions = !isShowOptions"
          class="competency-tree__chevron"
          :class="{ 'competency-tree__chevron--rotated': isShowOptions }"
        />
        <TheCheckbox
          class="competency-tree__checkbox"
          :model-value="state.allFilter"
          :label="data.name"
          :is-indeterminate="isIndeterminate"
          @update:model-value="selectAll"
        />
      </div>
      <div v-if="isShowOptions" class="competency-tree__node-children">
        <div
          v-for="(item, id) in data.children"
          :key="id"
          :class="
            item.children
              ? 'competency-tree__child'
              : 'competency-tree__child--leaf'
          "
        >
          <TreeNode :data="item" :input-search="inputSearch" />
        </div>
      </div>
    </div>
    <div v-else>
      <TheCheckbox
        :value="data.id || ''"
        :label="data.name"
        v-model="levelsFilter"
        @update:model-value="(value: unknown[], flag: boolean) => updateLevelFilter(data.id as number, flag)"
        class="competency-tree__leaf-checkbox"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from "vue";
import { MiniChevronRightIcon } from "../components/icons";
import TheCheckbox from "./TheCheckbox.vue";
import { type OrganisationStructureResource, getAllIds } from "../utils";
import { inject } from 'vue'
import type {FilterContext } from "./CompetencyTree.vue";
const props = defineProps<{
  data: OrganisationStructureResource;
  inputSearch?: string;
}>();

const { levelsFilter, updateLevelFilter, updateLevelFilterAll } = inject<FilterContext>('levelsfilter')!
const state = reactive<{
  data: OrganisationStructureResource;
  allFilter: boolean;
}>({
  data: props.data,
  allFilter: true,
});
const isShowOptions = ref<boolean>(false);
const includesId = computed<number[]>(() => {
  if (props.data.children) {
    return getAllIds(props.data.children);
  } else {
    return [];
  }
});

const openByInputSearch = (
  data: OrganisationStructureResource[]
): boolean[] => {
  const needToOpen: boolean[] = [];
  data.forEach((item) => {
    if (item.name?.toLowerCase().includes(props.inputSearch!.toLowerCase())) {
      needToOpen.push(true);
    }
    if (item.children) {
      needToOpen.push(...openByInputSearch(item.children));
    }
  });
  return needToOpen;
};
const isIndeterminate = computed<boolean>(() => {
  if (props.data.children) {
    if (
      includesId.value.filter((el) => levelsFilter.value.includes(el)).length <
        includesId.value.length &&
        includesId.value.some((el) => levelsFilter.value.includes(el))
    )
      return true;
  }
  return false;
});

const selectAll = (value: boolean): void => {
  if (props.data.children) {
    state.allFilter = value;
    updateLevelFilterAll(includesId.value, value);
  }
};

watch(
  () => props.inputSearch,
  () => {
    if (!props.inputSearch) {
      isShowOptions.value = false;
    }
  }
);

watch(
  () => levelsFilter.value,
  () => {
    if (props.data.id && props.data.children?.length) {
      if (
        includesId.value.filter((el) => levelsFilter.value.includes(el))
          .length === includesId.value.length &&
        levelsFilter.value.length > 0
      ) {
        if (!levelsFilter.value.includes(props.data.id))
          updateLevelFilter(props.data.id as number, true);
      } else if (levelsFilter.value.includes(props.data.id)) {
        updateLevelFilter(props.data.id as number, false);
      }
    }
  }
);
watchEffect(() => {
  if (props.data.children) {
    state.allFilter =
    includesId.value.some((el) => levelsFilter.value.includes(el));
    if (props.inputSearch) {
      isShowOptions.value = openByInputSearch(props.data.children).some(
        (el) => el == true
      );
    }
  }
});
</script>
