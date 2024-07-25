<template>
 <div>
  <div class="ac-trend">
    <slot v-if="slots.default"></slot>
    <div v-else :style="{color: textColor}">{{text}}</div>
    <component :is="`el-icon${toLine(type)}`" :color="color"></component>
  </div>
 </div>
</template>

<script setup name="trend">
import {useSlots} from "vue";
import {toLine} from "@/utils";

defineProps({
  type: {
    type: String,
    default: 'ArrowUp'
  },
  color: {
    type: String,
    default: 'red'
  },
  text: {
    type: String,
    default: '增长趋势'
  },
  textColor: {
    type: String,
    default: '#000'
  }
})
let slots = useSlots()
</script>

<style lang="less" scoped>
.ac-trend{
  display: flex;
}
</style>