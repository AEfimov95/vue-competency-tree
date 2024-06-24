import { App } from "vue";
import CompetencyTree from "./components/CompetencyTree.vue";
import vClickOutside from "./directives/click-outside";
import { type OrganisationStructureResource } from "./utils";
import './assets/style.css';
const setupCompetencyTree = {
  install(app: App): void {
    app.component("CompetencyTree", CompetencyTree);
    app.directive("clickOutside", vClickOutside);
  },
};

export { type OrganisationStructureResource, setupCompetencyTree as default };
