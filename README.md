[![NPM Version](https://img.shields.io/npm/v/vue-competency-tree.svg)](https://www.npmjs.com/package/vue-competency-tree)


# Vue Competency Tree

A Vue 3 component for displaying a competency tree with nested checkboxes and search functionality.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Events](#events)
- [Custom CSS Variables](#custom-css-variables)
- [Example of Customizing Styles](#example-of-customizing-styles)
- [Demo](#demo)

## Installation

To install the package, you can use npm or yarn:

```bash
npm install vue-competency-tree
# or
yarn add vue-competency-tree
```

## Usage

First, you need to register the component globally in your main entry file (e.g., `main.js` or `main.ts`):

```javascript
import { createApp } from "vue";
import App from "./App.vue";
import setupCompetencyTree from "vue-competency-tree";

const app = createApp(App);

app.use(setupCompetencyTree);

app.mount("#app");
```

Then, you can use the `CompetencyTree` component in your Vue components:

```vue
<template>
  <div>
    <CompetencyTree
      :treeData="treeData"
      :isDisabled="!treeData.length"
      :allLevelsPlaceholder="'All Levels'"
      :searchInputPlaceholder="'Search...'"
      :selectAllLabel="'Select All'"
      :noResultLabel="'No results found'"
      :maxHeight="'200px'"
      v-model="selectedIds"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      treeData: [
        // your tree data here
      ],
      selectedIds: [],
    };
  },
};
</script>
```

### Props

| Prop Name                | Type                              | Default              | Description                                                                                                            |
| ------------------------ | --------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `isDisabled`             | `boolean`                         | `false`              | Disables the dropdown and its contents.                                                                                |
| `treeData`               | `OrganisationStructureResource[]` | `[]`                 | Array of objects representing the tree structure. See [OrganisationStructureResource](#organisationstructureresource). |
| `allLevelsPlaceholder`   | `string`                          | `"All Levels"`       | Placeholder text when all levels are selected.                                                                         |
| `searchInputPlaceholder` | `string`                          | `"Search"`           | Placeholder text for the search input.                                                                                 |
| `selectAllLabel`         | `string`                          | `"Select All"`       | Label for the "Select All" checkbox.                                                                                   |
| `noResultLabel`          | `string`                          | `"No results found"` | Message to display when no results are found in the search.                                                            |
| `maxHeight`              | `string`                          | `'60vh'`             | Maximum height of the tree container.                                                                                  |
| `modelValue`             | `number[]`                        | `[]`                 | Array of selected IDs.                                                                                                 |

### Events

| Event Name          | Payload Type | Description                                |
| ------------------- | ------------ | ------------------------------------------ |
| `update:modelValue` | `number[]`   | Emitted when the selected IDs are updated. |

### OrganisationStructureResource

```typescript
interface OrganisationStructureResource {
  id?: number | null;
  name: string;
  children?: OrganisationStructureResource[] | null;
}
```

### Custom CSS Variables

The component provides the following CSS variables for easy customization of its appearance:

| Variable Name             | Default Value                           | Description                               |
| ------------------------- | --------------------------------------- | ----------------------------------------- |
| `--tree-checkbox-checked` | `#27ae60`                               | Color of the checked checkbox.            |
| `--tree-border`           | `#ebeff5`                               | Border color.             |
| `--tree-background`       | `#fff`                                  | Background color.         |
| `--tree-disabled`         | `#7e899a`                               | Color used when the dropdown is disabled. |
| `--tree-menu-shadow`      | `0px 0px 8px 0px rgba(45, 50, 57, 0.1)` | Box shadow for the dropdown menu.         |

### Example of Customizing Styles

You can customize the component styles by setting the CSS variables in your global CSS or a scoped style block:

```css
:root {
  --tree-checkbox-checked: #ff6347;
  --tree-border: #ccc;
  --tree-background: #f9f9f9;
  --tree-disabled: #d3d3d3;
  --tree-menu-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}
```

## Demo

Check out the live demo [here](https://stackblitz.com/edit/vitejs-vite-d1m6z7).
