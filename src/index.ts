import { App } from "vue";
import CompetencyTree from "./components/CompetencyTree.vue";
import vClickOutside from "./directives/click-outside";
import { type OrganisationStructureResource } from "./utils";

const setupCompetencyTree = {
  install(app: App): void {
    app.component("CompetencyTree", CompetencyTree);
    app.directive("clickOutside", vClickOutside);
  },
};

export { CompetencyTree, vClickOutside, type OrganisationStructureResource, setupCompetencyTree as default };
