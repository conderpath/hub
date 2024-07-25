<template>
 <div class="ac-notification">
   <el-popover
       placement="bottom"
       :width="300"
       trigger="click"
       popper-class="ac-notification-popover"
   >
     <template #default>
       <slot></slot>
     </template>
     <template #reference>
       <el-badge :value="value" :max="max" :is-dot="isDot">
         <component :is="`el-icon${toLine(type)}`"></component>
       </el-badge>
     </template>
   </el-popover>

 </div>
</template>

<script setup>
import {toLine} from "@/utils";

defineProps({
  value: {
    type: [String, Number],
    default: ''
  },
  max: {
    type: Number,
    default: 99,
  },
  isDot: {
    type: Boolean,
    default: false
  },

  type: {
    type: String,
    default: 'Bell'
  }
})
</script>

<style lang="less" scoped>
.ac-notification{
  deep(.el-popper){
    padding: 0!important;
  }
}
</style>