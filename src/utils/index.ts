export interface OrganisationStructureResource {
  id?: number | null;
  name: string;
  children?: OrganisationStructureResource[] | null;
}

export { getAllIds } from "./getAllIds";
export { filterByName } from "./filterByName";
