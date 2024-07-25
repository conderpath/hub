<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 300px; overflow-y: hidden;"
        v-model="value"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import prop from '@/components/widget/utils/props'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
const props = defineProps({
  modelValue: {
    ...prop().props
  }
})
let emits = defineEmits(['update:modelValue'])
let value = ref(null)
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }
const mode = ref('default')
watch(value,val=>{
  emits('update:modelValue', val)
})
watch(()=>props.modelValue,val=>{
  value.value = val
},{immediate: true})

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    // value.value = '<p>模拟 Ajax 异步设置内容</p>'
  }, 1500)
})
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const handleChange = editor=>{
}
</script>

<style scoped>
</style>