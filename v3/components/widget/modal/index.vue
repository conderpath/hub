<template>
  <div  :class="{'ac-modal': scroll}">
    <el-dialog
        v-model="dialogVisible"
        v-bind="$attrs"
    >
      <template #default>
        <slot></slot>
      </template>
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";

let props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  scroll: {
    type: Boolean,
    default: true
  }
})
let emits = defineEmits(['update:visible'])
let dialogVisible = ref(props.visible)
watch(()=> props.visible, val=> dialogVisible.value = val)
watch(dialogVisible,val=> emits('update:visible', val))
</script>

<style lang="less" scoped>
deep(.el-dialog)  {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
  }
}

</style>