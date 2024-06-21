<template>
  <div class="competency-tree__checkbox-wrapper">
    <label class="competency-tree__checkbox-label">
      <input
        @input="onInput"
        type="checkbox"
        :checked="isChecked"
        :value="value"
        class="competency-tree__checkbox-input"
      />
      <div
        class="competency-tree__checkbox-box"
        :class="{
          'competency-tree__checkbox-box--checked': isChecked,
          'competency-tree__checkbox-box--unchecked': !isChecked,
        }"
      >
        <svg
          v-if="isIndeterminate"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          class="competency-tree__checkbox-indeterminate"
        >
          <mask
            id="mask0_648_43120"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="20"
            height="20"
          >
            <rect width="20" height="20" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_648_43120)">
            <path
              d="M4.16675 10.8333V9.16666H15.8334V10.8333H4.16675Z"
              fill="white"
            />
          </g>
        </svg>
        <svg
          v-if="isChecked && !isIndeterminate"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          class="competency-tree__checkbox-checked"
        >
          <mask
            id="mask0_1518_1435"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="20"
            height="20"
          >
            <rect width="20" height="20" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_1518_1435)">
            <path
              d="M7.9585 15.0003L3.2085 10.2503L4.396 9.06283L7.9585 12.6253L15.6043 4.97949L16.7918 6.16699L7.9585 15.0003Z"
              fill="white"
            />
          </g>
        </svg>
      </div>
      <span class="competency-tree__checkbox-label-text">
        {{ label }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface Props {
  value?: string | number;
  label: string | number;
  modelValue?: unknown;
  isIndeterminate?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);

const isChecked = computed<boolean>(() => {
  if (props.isIndeterminate) return true;
  if (props.modelValue instanceof Array) {
    return props.modelValue.includes(props.value);
  }
  return props.modelValue === true;
});

const onInput = (event: any): void => {
  if (props.modelValue instanceof Array) {
    if (event.target.checked) {
      emit(
        "update:modelValue",
        [...props.modelValue, props.value],
        event.target.checked
      );
    } else {
      emit(
        "update:modelValue",
        props.modelValue.filter((o) => o !== props.value),
        event.target.checked
      );
    }
  } else {
    emit("update:modelValue", event.target.checked);
  }
};
</script>
<style>
.competency-tree__checkbox-wrapper {
  display: flex;
  align-items: center;
}

.competency-tree__checkbox-label {
  display: flex;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  align-items: center;
}

.competency-tree__checkbox-input {
  display: none;
}

.competency-tree__checkbox-box {
  height: 1.25rem;
  width: 1.25rem;
  min-width: 1.25rem;
  border-radius: 0.25rem;
  box-sizing: border-box;
}

.competency-tree__checkbox-box--checked {
  background-color: var(--tree-checkbox-checked);
  border: none;
}

.competency-tree__checkbox-box--unchecked {
  border: 1px solid var(--tree-border);
  background-color: var(--tree-background);
}

.competency-tree__checkbox-indeterminate {
  width: 100%;
  height: 100%;
}

.competency-tree__checkbox-checked {
  width: 100%;
  height: 100%;
}

.competency-tree__checkbox-label-text {
  font-size: 1rem;
}
</style>
