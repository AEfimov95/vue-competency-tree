import { getAllIds } from "./getAllIds";

export interface OrganisationStructureResource {
  id?: number | null;
  name: string;
  children?: OrganisationStructureResource[] | null;
}

export { getAllIds };
