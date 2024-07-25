<template>
  <div class="page_search">
    <transition name="fade-form">
      <PageForm
        v-show="visibleForm"
        :model="model"
        :fields="fields"
        :search-index="searchIndex"
        @query="queryList"
      />
    </transition>
    <div
      v-show="showCondition"
      class="page_line"
    ></div>
    <PageTable
      ref="tableRef"
      :search-api="searchApi"
      :count-api="countApi"
      :model="model"
      :columns="filterColumns"
      :fields="fields"
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
      :show-form.sync="showForm"
      :agg="agg"
      @onAddBtnClick="onAddBtnClick"
      @onDelBtnClick="onDelBtnClick"
      @onSelectionChange="onSelectionChange"
    >
      <template v-slot:actions>
        <slot name="actions" />
        <div class="right-setting">
          <FilterColumns :columns="columns" :show-form.sync="showForm" @filter="doFilter" />
        </div>
      </template>
    </PageTable>
  </div>
</template>

<script>
// import moduleName from 'module'
import create from '../../core/utils/create'
import PageForm from './PageForm'
import PageTable from './PageTable'
import FilterColumns from './FilterColumns.vue'
export default create({
  name: 'page-search',
  components: {
    PageForm,
    PageTable,
    FilterColumns
  },
  props: {
    searchApi: {
      type: String,
      required: true
    },
    countApi:{
      type: String,
      required: false
    },
    model: {
      type: Object,
      defatult () {
        return {}
      }
    },
    // 搜索条件
    fields: {
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
      default: 8
    },
    primaryKey: {
      type: String,
      default: 'id'
    },
    defaultSelected:{
      type: Array,
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
    searchIndex: {
      type: Number,
      default: 4
    },
    agg: {
      type: Boolean,
      default:false
    }
  },
  data () {
    return {
      filterColumns: [],
      showForm: true
    }
  },
  computed: {
    visibleForm() {
      return this.showForm && this.showCondition
    }
  },
  watch: {
    columns: {
      handler(val) {
        this.filterColumns = Array.from(val)
      },
      immediate: true
    },
  },
  created () {

  },
  mounted () {

  },
  methods: {
    queryList (pageNo) {
      this.$refs.tableRef.queryList(pageNo)
    },
    onAddBtnClick () {
      this.$emit('onAddBtnClick')
    },
    onDelBtnClick () {
      this.$emit('onDelBtnClick')
    },
    onSelectionChange(val) {
      this.$emit('onSelectionChange',val)
    },
    doFilter(props) {
      this.filterColumns = this.columns.filter(item=>!props.includes(item.prop))
    }
  }
})
</script>

<style lang="scss" scoped>
.fade-form-enter-active,
.fade-form-leave-active {
  transition: opacity 0.5s ease;
}

.fade-form-enter-from,
.fade-form-leave-to {
  opacity: 0;
}
.right-setting {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  font-size: 16px;
}
</style>
