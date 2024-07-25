<template>
  <div class="header-menu" v-if="validateData(options.header, config.header)">
    <div class="left-menu">
      <el-button type="primary" v-permission="getPermission('addBtn')" @click="doAdd">新建</el-button>
      <slot name="header-left-menu"></slot>
    </div>
    <div class="right-menu">
      <slot name="header-right-menu"></slot>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { validateData } from '../utils'
const { options, config, getPermission, doAdd } = inject('tbl')
</script>

<style lang="less">
.header-menu {
  display: flex;
  align-items: center;
  height: 60px;
  margin-bottom: 10px;

  .left-menu {
    flex: 1;
  }

  .right-menu {
    text-align: right;
  }
}
</style>
