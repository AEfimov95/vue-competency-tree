import { reactive, toRefs } from 'vue';

const state = reactive({
  levelsFilter: [] as number[],
});

const updateLevelFilter = (id: number, flag: boolean) => {
  const updatedFilter = new Set(state.levelsFilter);
  if (updatedFilter.has(id)) {
    if (!flag) {
      updatedFilter.delete(id);
    }
  } else {
    if (flag) {
      updatedFilter.add(id);
    }
  }
  state.levelsFilter = Array.from(updatedFilter);
};

const updateLevelFilterAll = (ids: number[], flag: boolean) => {
  const filterSet = new Set(state.levelsFilter);

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

  state.levelsFilter = Array.from(filterSet);
};

export const useGlobalStore = () => {
  return {
    ...toRefs(state),
    updateLevelFilter,
    updateLevelFilterAll,
  };
};