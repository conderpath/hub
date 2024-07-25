<template>
  <div>
    <el-button type="primary" @click="chooseIcon">
      <slot>图标选择器</slot>
    </el-button>
    <el-dialog :model-value="visible" :title="title" @close="doClose">
      <ul class="content">
        <li v-for="item in list" @click="copyIcon(item)" :key="item.component">
          <component :is="item.component"></component>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script setup name="chooseIcon">
import * as Icons from '@element-plus/icons-vue'
import {ref} from "vue";
import {toLine} from "@/utils";
import {ElMessage} from "element-plus";
const props = defineProps({
  title: String,
  visible: Boolean
})
let list = ref([])
for(let i in Icons) {
  list.value.push({
    component: `el-icon${toLine(i)}`
  })
}
const emits = defineEmits(['update:visible'])
const chooseIcon = ()=>{
  emits('update:visible', true)
}
const doClose = ()=>{
  emits('update:visible', false)
}
const copyIcon = (item)=>{
  useCopy(`<${item.component}/>`)
  emits('update:visible', false)
}
const useCopy = (text)=>{
  let input = document.createElement('input')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
  ElMessage.success('复制成功')
}
</script>

<style lang="less" scoped>
.content{
  display: flex;
  //justify-content: space-between;
  flex-wrap: wrap;
  li{
    margin: 10px;
    cursor: pointer;
    svg{
      width: 20px;
      height: 20px;
    }
  }
}
</style>