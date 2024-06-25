import type { OrganisationStructureResource } from "../types";

export const filterByName = (
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