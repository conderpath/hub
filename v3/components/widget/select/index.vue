<template>
  <el-select v-model="value" v-on="event" @change="change" :clearable="clearable || false">
    <el-option v-for="option in dicData" :value="option.value" :label="option.label" :key="option.value">{{option.label}}</el-option>
  </el-select>
</template>

<script setup>
import prop from '@/components/widget/utils/props'
import {computed, ref, watch} from "vue";
let props = defineProps({
  ...prop().props
})
let emits = defineEmits(['update:modelValue'])
let value = ref(null)
watch(value,val=>{
  emits('update:modelValue', val)
})
watch(()=>props.modelValue,val=>{
  console.log('select', val)
  value.value = val
},{ immediate: true})

</script>

<style lang="less" scoped>

</style>