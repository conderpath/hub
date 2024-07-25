<template>
  <el-table-column label="操作" v-if="validateData(options.menu, config.menu)"
    :fixed="validateData(options.menuFixed, config.menuFixed)" :width="options.menuWidth || config.menuWidth">
    <template #default="{ row, $index }">
      <div style="display: flex;" v-if="options.cellBtn">
        <el-button text v-if="!row.$cellEdit" @click="rowEdit(row)" :disabled="disableList[$index]">编辑</el-button>
        <el-button text v-if="row.$cellEdit" @click="rowSave(row, $index)"
          :disabled="disableList[$index]">保存</el-button>
        <el-button text v-if="row.$cellEdit" @click="rowCancel(row, $index)"
          :disabled="disableList[$index]">取消</el-button>
        <el-button type="danger" text v-if="!row.$cellEdit" :disabled="disableList[$index]">删除</el-button>
      </div>
      <div style="display: flex;" v-else>
        <el-button type="text" size="small" v-permission="getPermission('detailBtn', row)"
          @click="doView(row)">查看</el-button>
        <el-button type="text" size="small" v-permission="getPermission('editBtn', row)"
          @click="doEdit(row)">编辑</el-button>
        <el-button type="danger" text size="small" v-permission="getPermission('deleteBtn', row)"
          @click="doDelete(row)">删除</el-button>
        <slot v-bind="Object.assign({}, row, { _index: $index })" name="operation"></slot>
      </div>

    </template>
  </el-table-column>
</template>
<script setup>
import { validateData } from '../utils';
import { inject } from 'vue'
const { options, config, getPermission, doView, doEdit, doDelete, rowEdit, rowCancel, rowSave, disableList } = inject('tbl')
</script>


<style lang="less"></style>
