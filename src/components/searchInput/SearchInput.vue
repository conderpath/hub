<template>
  <div class="page-input-search">
    <el-input
      v-model="searchName"
      :readonly="readonly"
      :disabled="disabled"
    >
      <i
        v-if="searchName.length"
        slot="suffix"
        class="el-input__icon el-icon-close"
        @click="handleClear"
      />
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="handleSearch"
      />
    </el-input>
    <el-dialog
      :visible.sync="visible"
      width="70%"
      :title="title"
      @close="handleCancle"
    >
      <div class="page_search">
        <SearchForm
          ref="formRef"
          :model="conditions"
          :fields="searchFields"
          @query="queryList"
        />
        <div class="page_line" />
        <SearchTable
          ref="tableRef"
          :search-api="searchApi"
          :count-api="countApi"
          :model="conditions"
          :fields="searchFields"
          :columns="columns"
          :align="align"
          :pagination="pagination"
          :page-choose-sizes="pageChooseSizes"
          :layout="layout"
          :search="search"
          :before-search-hook="beforeSearchHook"
          :after-search-hook="afterSearchHook"
          :show-add="showAdd"
          :show-del="showDel"
          :span="span"
          :default-selected="defaultSelected"
          :primary-key="primaryKey"
          :reserve-selection="reserveSelection"
          @onAddBtnClick="onAddBtnClick"
          @onDelBtnClick="onDelBtnClick"
          @onSelectionChange="onSelectionChange"
        >
          <template v-slot:actions>
            <slot name="actions" />
          </template>
        </SearchTable>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleCancle">取 消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import moduleName from 'module'
import SearchForm from './SearchForm'
import SearchTable from './SearchTable'
export default {
  name: 'SearchInput',
  components: {
    SearchForm,
    SearchTable
  },
  props:{
    rowkey: {
      type: String
    },
    searchApi: {
      type: String,
      required: true
    },
    countApi: {
      type:String,
    },
    conditions: {
      type: Object,
      defatult () {
        return {}
      }
    },
    // 搜索条件
    searchFields: {
      type: Array,
      default () {
        return []
      }
    },
    // 表格列
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    align: {
      type: String,
      default: 'left'
    },
    // 是否显示分页
    pagination: {
      type: Boolean,
      default: true
    },
    pageChooseSizes: {
      type: Array,
      default () {
        return [10, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next'
    },
    // 是否立即查询
    search: {
      type: Boolean,
      default: true
    },
    beforeSearchHook: {
      type: Function
    },
    afterSearchHook: {
      type: Function
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    showDel: {
      type: Boolean,
      defalut: false
    },
    span: {
      type: Number,
      default: 12
    },
    primaryKey: {
      default: 'id'
    },
    defaultSelected:{
      default() {
        return []
      }
    },
    reserveSelection:{
      type: Boolean,
      default: false
    },
    showCondition: {
      type: Boolean,
      default: true
    },
    displayName:{
      default: ''
    },
    disabled:{
      type: Boolean,
      default: false
    },
    readonly:{
      type: Boolean,
      default: true
    },
    title:{
      default:'请选择'
    }
  },
  data () {
    return {
      searchName: '',
      visible: false,
    }
  },
  watch:{
    displayName:{
      handler(val) {
        this.searchName = val
      },
      immediate: true
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    queryList (pageNo) {
      this.$refs.tableRef.queryList(pageNo)
    },
    handleSearch() {
      this.visible = true
      this.$nextTick(()=>{
        this.queryList(1)
      })
    },
    handleCancle() {
      this.$refs.formRef.onResetBtnClick()
      this.selected = []
      this.visible = false
    },
    handleConfirm() {
      this.$emit('chooseItem',this.selected, this.rowkey)
      this.handleCancle()
    },
    onSelectionChange(selected) {
      this.selected = selected
    },
    onAddBtnClick () {
      this.$emit('onAddBtnClick')
    },
    onDelBtnClick () {
      this.$emit('onDelBtnClick')
    },
    handleClear() {
      this.$emit('chooseItem',[],this.rowkey)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
