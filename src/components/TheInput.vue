<template>
  <input
    @input="onInput"
    :value="modelValue"
    :placeholder="placeholder"
    class="competency-tree__input"
    :class="{ 'competency-tree__input--disabled': disabled }"
    :disabled="disabled"
    ref="inputRef"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const emits = defineEmits(["update:modelValue"]);
const props = defineProps<{
  disabled?: boolean;
  placeholder: string;
  modelValue: string;
}>();
const inputRef = ref<HTMLInputElement>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emits("update:modelValue", target.value);
};
onMounted(() => {
  inputRef.value?.focus();
});
</script>
