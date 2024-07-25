<template>
  <div style="padding: 20px;">
    <ac-form :options="searchOptions" v-model="searchParams" @submit="search">
      <template v-for="item in searchSlots" v-slot:[`${item.prop}Form`]="scope">
        <slot v-bind="Object.assign(scope, { searchParams })" :name="getSlotName(item, 'S')"></slot>
      </template>
    </ac-form>
    <el-divider />
    <HeaderMenu>
      <template #header-left-menu>
        <slot name="header-left-menu"></slot>
      </template>
      <template #header-right-menu>
        <slot name="header-right-menu"></slot>
      </template>
    </HeaderMenu>
    <el-form :model="cellForm">
      <el-table :data="cellForm.list" :border="options.border">
        <!-- 暂无数据提醒 -->
        <template #empty>
          <div>
            <slot name="empty" v-if="$slots.empty"></slot>
            <ac-empty v-else></ac-empty>
          </div>
        </template>
        <template v-for="(item, index) in options.columns">
          <el-table-column v-if="!validateData(item.hide, false)" :show-overflow-tooltip="item.overHidden"
            :prop="item.prop" :label="item.label" :width="item.width || ''">
            <template #default="{ row, $index }">
              <el-form-item :prop="`list.${index}.${item.prop}`" :rules="item.rules" v-if="row.$cellEdit && item.cell">
                <!-- <slot v-if="$slots[item.prop]" :name="item.prop" :row="row" :index="$index"></slot>
                <span v-else-if="item.type === 'select'">{{ selectLabel(item, row[item.prop]) }}</span>
                <span v-else>{{ item.formatter && item.formatter(row[column.prop], row) || row[item.prop] }}</span> -->
                <component :is="getComponent(item)" v-bind="item" v-model="row[item.prop]">
                </component>
              </el-form-item>
              <template v-else>
                <slot v-if="$slots[item.prop]" :name="item.prop" :row="row" :index="$index"></slot>
                <span v-else-if="item.type === 'select'">{{ selectLabel(item, row[item.prop]) }}</span>
                <span v-else>{{ item.formatter && item.formatter(row[item.prop], row) || row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </template>
        <column-menu>
          <template #operation="scope">
            <slot name="operation" v-bind="scope"></slot>
          </template>
        </column-menu>
      </el-table>
    </el-form>
  </div>
</template>

<script setup>
import tableProps from "@/components/widget/table/props";
import { computed, provide, ref, useSlots, watch } from "vue";
import { validateData, deepClone, getSlotName, getComponent } from "@/components/widget/utils";
import tblConfig from './config'
import ColumnMenu from './column-menu.vue'
import HeaderMenu from './header-menu.vue'

const $slots = useSlots()
const props = defineProps({
  ...tableProps
})
const config = ref(tblConfig)
const list = ref([])
const disableList = ref({})
const emit = defineEmits(['update:searchData', 'view', 'edit', 'delete', 'add'])
const searchParams = ref(props.searchData)
const selectLabel = ({ dicData = [] }, val) => {
  if (Array.isArray(val)) {
    let filterArray = dicData.filter(item => {
      return val.includes(item.value)
    })
    return filterArray.map(item => item.label).join(',')
  } else {
    let item = dicData.find(item => item.value === val) || {}
    return item.label
  }
}
const search = (form, hideLoading) => {
  console.log('查询啦', form)
  setTimeout(() => {
    hideLoading && hideLoading()
  }, 2000)
}
watch(() => props.data, val => {
  if (Array.isArray(val)) {
    let arr = deepClone(val)
    list.value = arr
  }
}, {
  deep: true,
  immediate: true
})
const cellForm = computed(() => {
  if (Array.isArray(list.value)) {
    return {
      list: list.value
    }
  }
  return {
    list: []
  }
})
const rowKey = computed(() => {
  return props.options.rowKey || 'id'
})
const kvMap = computed(() => {
  if (Array.isArray(props.data)) {
    return props.data.reduce((prev, cur) => {
      prev[cur[rowKey.value]] = cur
      return prev
    }, {})
  }
  return {}
})
watch(searchParams, val => {
  emit('update:searchData', val)
}, { deep: true })
const searchOptions = computed(() => {
  return {
    submitText: '查询',
    emptyText: '重置',
    columns: props.options.columns.filter(item => item.search)
  }
})
const searchSlots = computed(() => {
  return props.options.columns.filter(item => $slots[item.prop + 'Search'])
})

const getPermission = (type, row) => {
  if (typeof props.permission === 'function') {
    return props.permission(type, row)
  }
  return true
}
const doView = (row) => {
  emit('view', row)
}
const doEdit = (row) => {
  emit('edit', row)
}
const doDelete = (row) => {
  emit('delete', row)
}
const rowEdit = row => {
  row.$cellEdit = true
}
const rowCancel = (row, index) => {
  if (row.hasOwnProperty(rowKey.value)) {
    let pk = row[rowKey.value]
    let originRow = kvMap.value[pk]
    Object.assign(row, originRow, { $cellEdit: false })
  } else {
    list.value.splice(index, 1)
  }
}
const rowSave = (row, index) => {
  disableList.value[index] = true
  const callBack = () => {
    disableList.value[index] = false
    row.$cellEdit = false
  }
  emit('rowSave', row, callBack)
}
const doAdd = () => {
  if (props.options.cellBtn) {
    list.value.unshift({
      $cellEdit: true
    })
  } else {
    emit('add')
  }
}
provide('tbl', {
  getPermission,
  config,
  options: props.options,
  doEdit,
  doView,
  doDelete,
  doAdd,
  rowEdit,
  rowCancel,
  rowSave,
  disableList,
})
</script>

<style lang="less" scoped>
.empty {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.el-table {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>