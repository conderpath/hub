<template>
  <div class="form-menus">
    <el-button type="primary" v-if="showSubmit" :loading="loading" @click="submit">{{ submitText }}</el-button>
    <el-button @click="reset" v-if="showEmpty">{{ emptyText }}</el-button>
  </div>
</template>

<script setup>
import { inject } from "vue";

const { submit, reset, showSubmit, showEmpty, submitText, emptyText, loading } = inject('safe')
</script>

<style lang="less" scoped>
.form-menus {
  text-align: right;
  margin: 18px 0;
  margin-top: 6px;
}
</style>