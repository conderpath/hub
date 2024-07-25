<template>
 <div class="group">
   <el-collapse v-model="activeIndex" @change="handleChange">
     <el-collapse-item :title="tab.title" :name="index" v-for="(tab,index) in tabs" :class="index == 0?'no-arrow':''">
       <slot :tab="tab"></slot>
     </el-collapse-item>
   </el-collapse>
 </div>
</template>

<script setup>
import {ref, watch} from "vue";

let props = defineProps({
  tabs: {
    type: Array,
    default() {
      return []
    }
  },
  type:{
    type: String,
    default: 'collapse'
  },
  active: {
    type: Array,
    default: [0]
  }
})
let emits = defineEmits(['change'])
let activeIndex = ref(null)
const handleChange = val=>{
  emits('change', val)
}
watch(()=>props.active, val=>{
  activeIndex.value = val
}, {immediate: true})

</script>

<style lang="less" scoped>
.group{
  width: 100%;
  :deep(.no-arrow) {
    .el-collapse-item__header{
      display: none!important;
    }
  }
  :deep(.el-collapse){
    border: none;
    .el-collapse-item__wrap {
      border: none;
    }
  }
}
</style>