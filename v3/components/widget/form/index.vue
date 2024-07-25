<template>
  <div class="ac-form">
    <el-form :model="form" :label-position="getLabelPosition()" ref="formRef">
      <el-row :span="24">
        <ac-group :tabs="groups">
          <template v-slot="{ tab }">
            <el-row>
              <template v-for="(column, index) in tab.columns">
                <el-col :span="getSpan(column)">
                  <el-form-item :key="column.prop" v-if="validateDisplay(column)" :label="column.label"
                    :prop="column.prop" :rules="column.rules" :label-width="getLabelWidth(column, options)">
                    <template #label v-if="$slots[getSlotName(column, 'L')]">
                      <slot :name="getSlotName(column, 'L')"></slot>
                    </template>
                    <template v-if="$slots[getSlotName(column, 'F')]">
                      <slot :name="getSlotName(column, 'F')" :column="column"></slot>
                    </template>
                    <component v-else :is="getComponent(column)" v-bind="column" v-model="form[column.prop]">
                    </component>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </template>
        </ac-group>
      </el-row>
      <!--     <div class="form-footer">
       <el-button type="primary" v-if="showSubmit" :loading="loading" @click="submit(formRef)">提交</el-button>
       <el-button @click="reset(formRef)" v-if="showEmpty">清空</el-button>
     </div>-->
      <Menu></Menu>
    </el-form>
  </div>
</template>

<script setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import { deepClone, getComponent, getLabelWidth, validateNull, getSlotName } from "@/components/widget/utils";
import Menu from './menu.vue'
import { ElMessage } from "element-plus";
let form = ref({})
const formRef = ref()
let defaultSpan = ref(8)
let formCreate = ref(false)
let props = defineProps({
  options: {
    type: Object,
    required: true,
    default: () => {
      return {
        columns: [],
      }
    }
  },
  modelValue: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
let emits = defineEmits(['update:modelValue', 'submit'])
let loading = ref(false)

/*let columns = computed(()=>{
  return props.option.columns.map(item=>{
    return deepClone(item)
  })
})*/
let columns = computed(() => {
  let arr = []
  groups.value.forEach(group => {
    group.columns.forEach(column => {
      arr.push(deepClone(column))
    })
  })
  return arr
})
let groups = computed(() => {
  let options = deepClone(props.options)
  let groups = options.groups
  if (!groups || groups.length == 0) {
    options = Object.assign(options, {
      groups: [deepClone(options)]
    })
  } else {
    groups.unshift({
      ...options
    })
  }
  return options.groups
})
let showSubmit = computed(() => {
  let showSubmit = props?.options?.showSubmit
  if (!validateNull(showSubmit)) {
    return showSubmit
  }
  return true
})
let submitText = computed(() => {
  return props?.options?.submitText || '提交'
})
let showEmpty = computed(() => {
  let showEmpty = props?.options?.showEmpty
  if (!validateNull(showEmpty)) {
    return showEmpty
  }
  return true
})
let emptyText = computed(() => {
  return props?.options?.emptyText || '清空'
})
let getLabelPosition = () => {
  if (props.options.labelPosition) return props.options.labelPosition
  return 'right'
}
let initVal = modelValue => {
  if (!formCreate.value) {
    form.value = deepClone(modelValue)
    formCreate.value = true
  } else {
    form.value = Object.assign(form.value, modelValue)
  }
}
watch(() => props.modelValue, newVal => {
  initVal(newVal)
}, { immediate: true, deep: true })
watch(form, val => {
  emits('update:modelValue', val)
}, { deep: true, })
/*watch(columns,items=>{
  items.forEach(item=>{
    if(!form.value[item.prop]) {
      form.value[item.prop] = item.value || ''
    }
  })
}, {deep: true, immediate: true})*/
const submit = async (el) => {
  console.log(el)
  if (!formRef.value) return
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      showLoading()
      ElMessage.success('验证成功')
      emits('submit', form.value, hideLoading)
    } else {
      ElMessage.error('验证失败')
      console.log('error submit!', fields, form.value)
    }
  })
}
const reset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  // form.value = {}
}
const clearValidate = () => {
  if (!formRef.value) return
  formRef.value.clearValidate()
}
// 初始化数据
const dataFormat = () => {
  columns.value.forEach(item => {
    if (!form.value[item.prop]) {
      if (item.type === 'select') {
        form.value[item.porp] = item.val || undefined
      } else {
        form.value[item.prop] = item.val || ''
      }
    }
  })
  setTimeout(() => {
    formCreate.value = true
  })
}
const validateDisplay = column => {
  if (!validateNull(column.display)) {
    if (column.prop == 'uname') {
      // console.log(column.display, !!column.display, '---------')
    }
    return !!column.display
  }
  return true
}
const getSpan = column => {
  return column.span || props.options.span || defaultSpan.value
}
const hideLoading = () => {
  loading.value = false
}
const showLoading = () => {
  loading.value = true
}
onMounted(() => {
  setTimeout(() => {
    dataFormat()
  })
})
const validate = () => {
  return formRef.value.validate
}
const getFormData = () => {
  return form.value
}

defineExpose({
  validate,
  getFormData,
  clearValidate
})
provide('safe', {
  submit,
  reset,
  showSubmit,
  showEmpty,
  loading,
  submitText,
  emptyText,
  getLabelPosition,
  validateDisplay,
  getSpan
})
provide('reset', reset)
</script>

<style lang="less" scoped></style>