import { OrganisationStructureResource } from ".";

export const getAllIds = (data: OrganisationStructureResource[]): number[] => {
  const ids: number[] = [];
  const stack = [...data];
  while (stack.length) {
    const { id, children } = stack.pop()!;
    if (id) ids.push(id);
    if (children) stack.push(...children);
  }
  return ids;
};
