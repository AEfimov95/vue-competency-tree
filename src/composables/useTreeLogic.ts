import { ref, computed } from "vue";
import { getAllIds, filterByName } from "../utils";
import type { OrganisationStructureResource, TreeLogic } from "../types";

export function useTreeLogic(
  treeData: OrganisationStructureResource[],
  allLevelsPlaceholder: string
): TreeLogic {
  const levelsFilter = ref<number[]>([]);
  const inputValue = ref<string>("");
  const selectedValue = ref<string>("");
  const hasElements = ref<boolean>(false);
  const allFilter = ref<boolean>(true);

  const TreeElements = computed<OrganisationStructureResource[]>(() => {
    if (inputValue.value) {
      return filterByName(treeData, inputValue.value);
    }
    return treeData;
  });

  const isLoaded = computed<boolean>(() => TreeElements.value.length > 0);
  const includesId = computed<number[]>(() => getAllIds(TreeElements.value));
  const isIndeterminate = computed<boolean>(() => {
    const included = includesId.value.filter((el) =>
      levelsFilter.value.includes(el)
    ).length;
    return included > 0 && included < includesId.value.length;
  });

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
    if (getAllIds(treeData).length === levelsFilter.value.length) {
      names.push(allLevelsPlaceholder);
    } else {
      selectedLevelsSearch(treeData, names);
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

  return {
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
  };
}
