import { ComputedRef, Ref } from "vue";

export interface OrganisationStructureResource {
  id?: number | null;
  name: string;
  children?: OrganisationStructureResource[] | null;
}
export interface FilterContext {
  levelsFilter: Ref<number[]>;
  updateLevelFilter: (id: number, flag: boolean) => void;
  updateLevelFilterAll: (ids: number[], flag: boolean) => void;
}
export interface TreeLogic {
  levelsFilter: Ref<number[]>;
  inputValue: Ref<string>;
  selectedValue: Ref<string>;
  hasElements: Ref<boolean>;
  allFilter: Ref<boolean>;
  TreeElements: ComputedRef<OrganisationStructureResource[]>
  isLoaded: ComputedRef<boolean>;
  includesId: ComputedRef<number[]>;
  isIndeterminate: ComputedRef<boolean>;
  selectedLevels: () => void;
  updateLevelFilter: (id: number, flag: boolean) => void;
  updateLevelFilterAll: (ids: number[], flag: boolean) => void;
}