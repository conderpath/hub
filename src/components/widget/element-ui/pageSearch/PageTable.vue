<template>
  <div class="page-basic-table">
    <div class="page_table">
      <div class="page_btn_group">
        <el-button
          v-if="showAdd"
          class="form_btn"
          icon="el-icon-plus"
          type="primary"
          @click="onAddBtnClick"
        >
          {{ $t('button.add') }}
        </el-button>
        <el-button
          v-if="showDel"
          type="danger"
          class="form_btn"
          icon="el-icon-delete"
          @click="onDelBtnClick"
        >
          {{ $t('button.delete') }}
        </el-button>
        <slot name="actions" />
      </div>
      <div v-if="columns.length && columns[0].type==='selection'" class="select-title-info">
        <p><i class="ac-icon-icon-info"></i>{{ $t('common.fields.selected') }}<span>{{ multipleSelection.length }}</span>{{ $t('common.fields.item') }}</p>
        <el-button type="text" @click="clearSelect">
          {{ $t('common.buttons.clear') }}
        </el-button>
      </div>
      <el-table
        ref="tbl"
        :data="list"
        style="width: 100%"
        class="page_table_detail"
        :row-key="primaryKey"
        :align="align"
        stripe
        border
        @selection-change="handleSelect"
        @sort-change="tablesortChange"
      >
        <template v-for="(col, index) in columns">
          <el-table-column
            v-if="inBuildinType(col)"
            :key="index"
            :type="getAttr(col, 'type')"
            :fixed="getAttr(col, 'fixed')"
            :width="getAttr(col, 'width')"
            :label="$t(getAttr(col, 'label'))"
            :reserve-selection="reserveSelection"
            :selectable="getAttr(col, 'selectable')"
          />
          <el-table-column
            v-if="!inBuildinType(col)"
            :key="index"
            :prop="getAttr(col, 'prop')"
            :label="$t(getAttr(col, 'label'))"
            :fixed="getAttr(col, 'fixed')"
            :width="getAttr(col, 'width')"
            :show-overflow-tooltip="getAttr(col,'tip')"
            :sortable="col.sort||false"
            :min-width="getAttr(col, 'minWidth')"
          >
            <template slot-scope="scope">
              <el-radio
                v-if="isType(col,'radio')"
                v-model="selected"
                :label="scope.row[primaryKey]"
                @change="handleSelect([scope.row])"
              >
                {{ '' }}
              </el-radio>
              <template v-else>
                <div
                  v-if="isType(col,'text')"
                  class="text field-wrap"
                >
                  {{ getVal(scope.row,col) }}
                </div>
                <div
                  v-else-if="isType(col,'link')"
                  class="link field-wrap"
                  @click="getEvents(col,scope.row,scope.$index)"
                >
                  <a>{{ getVal(scope.row,col) }}</a>
                </div>
                <div
                  v-else-if="isType(col,'select')"
                  class="select field-wrap"
                >
                  {{ getVal(scope.row,col) }}
                </div>
                <div
                  v-else-if="isType(col,'action')"
                  class="column-action field-wrap"
                >
                  <template v-for="btn in col.btns">
                    <div
                      v-if="isShow(btn,scope.row)"
                      :key="btn.label"
                      class="btn-item"
                    >
                      <el-button
                        v-if="!btn.pops"
                        :type="btn.type||'text'"
                        :size="btn.size||'small'"
                        @click="getEvents(btn,scope.row,scope.$index)"
                      >
                        <el-tooltip class="item" effect="dark" :content="$t(btn.label)" placement="top">
                          <i :class="icons[btn.icon]"></i>
                        </el-tooltip>
                      </el-button>
                      <el-popover
                        v-else-if="btn.pops"
                        placement="top"
                        :width="getAttr(col,'width')"
                        trigger="hover"
                      >
                        <div style="text-align: center; margin: 0">
                          <el-button
                            v-for="popBtn in btn.popBtns"
                            :key="popBtn.label"
                            size="small"
                            :type="popBtn.type||'text'"
                            @click="getEvents(btn,scope.row,scope.$index)"
                          >
                            {{ $t(`${popBtn.label}`) }}
                          </el-button>
                        </div>
                        <el-button
                          slot="reference"
                          :type="btn.type||'text'"
                          :size="btn.size||'small'"
                        >
                          {{ $t(`${btn.label}`) }}
                        </el-button>
                      </el-popover>
                    </div>
                  </template>
                </div>
              </template>
            </template>
          </el-table-column>
          <slot name="column" />
        </template>
      </el-table>
      <el-pagination
        v-if="pagination"
        background
        class="page_search_table_page"
        :current-page="tablePageIndex"
        :page-sizes="pageChooseSizes"
        :page-size="tablePageSize"
        :layout="layout"
        :total="tableTotal"
        @size-change="tablePageSizeChange"
        @current-change="tablePageIndexChange"
      />
    </div>
  </div>
</template>

<script>
// import moduleName from 'module'
import { dataCommonInsert } from '@/api/apiCommonInsert'
const originTypes = ['selectable']
export default {
  name: 'PageTable',
  components: {
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
    // 表单查询项
    model: {
      type: Object,
      default () {
        return {}
      }
    },
    // 展示列
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    fields: {
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
    primaryKey: {
      type: String,
      default: 'id'
    },
    defaultSelected: {
      type: Array,
      default () {
        return []
      }
    },
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 聚合服务进行查询
    agg: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: [],
      multipleSelection: [],
      selection: [],
      selected: null,
      tablePageIndex: 1,
      tablePageSize: 10,
      tableTotal: 0,
      icons: {
        delete: 'ac-icon-icon-delete1 red',
        edit: 'ac-icon-icon-edit',
        disable: 'el-icon-lock',
        enable: 'el-icon-unlock',
        bind: 'ac-icon-icon-binding-role1',
        groups: 'ac-icon-icon-binding-user-group1',
        column: 'ac-icon-icon-process-define1',
        org: 'ac-icon-icon-binding-maintain1',
        location: 'el-icon-map-location',
        calendar: 'el-icon-date'
      },
      orderFields: { fieldName: 'createTime', order: 'desc' },
    }
  },
  watch: {
    defaultSelected: {
      handler (val) {
        this.selection = [...val]
        this.selected = val && val.length ? val[0] : null
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    if (this.search) {
      this.queryList()
    }
  },
  mounted () {

  },
  methods: {
    async queryList (pageNo) {
      if (!this.searchApi) return
      if (this.agg) {
        await this.queryAggList()
        return
      }
      let data = { ...this.model }
      if (this.beforeSearchHook) {
        data = this.beforeSearchHook()
      }
      if (this.pagination) {
        if (pageNo) {
          this.tablePageIndex = pageNo
        }
        data.pageNo = this.tablePageIndex
        data.pageSize = this.tablePageSize
      }
      const res = await this.$http.post(this.searchApi, data)
      if (res.success) {
        if (this.pagination) {
          const list = (res.data && res.data.list) || []
          this.list = list
          if (this.afterSearchHook) {
            this.afterSearchHook(list)
          }
          this.tableTotal = (res.data && res.data.total) || 0
        } else {
          const list = res.data || []
          this.list = list
          if (this.afterSearchHook) {
            this.afterSearchHook(list)
          }
        }
        if (this.selection.length) {
          this.toggleChcecked()
        }
      }
    },
    async queryAggList (pageNo) {
      if (!this.searchApi) return
      let data = this.handleDealSearchData(this.model, this.fields)
      if (this.beforeSearchHook) {
        data = this.beforeSearchHook()
      }
      if (this.pagination) {
        if (pageNo) {
          this.tablePageIndex = pageNo
        }
        data.pageIndex = this.tablePageIndex - 1
        data.pageSize = this.tablePageSize
      }
      data.orderFields = [this.orderFields]
      data = dataCommonInsert(data)
      const res = await this.$apiDataRequest.request({
        api: this.searchApi,
        data,
        method: 'post'
      })
      if (res.msg === 'success') {
        if (this.pagination) {
          const list = res.data || []
          this.list = list
          if (this.afterSearchHook) {
            this.afterSearchHook(list)
          }
          this.getPageCount()
        } else {
          const list = res.data || []
          this.list = list
          if (this.afterSearchHook) {
            this.afterSearchHook(list)
          }
        }
        if (this.selection.length) {
          this.toggleChcecked()
        }
      }
    },
    getPageCount () {
      if (!this.countApi) return
      const data = this.handleDealSearchData(this.model, this.fields)
      this.$apiDataRequest.request({
        api: this.countApi,
        method: 'post',
        data: dataCommonInsert(this.beforeSearch ? this.beforeSearch(data) : data)
      }).then((res) => {
        this.tableTotal = res.data || 0
      })
    },
    // 选择checkbox
    handleSelect (selected) {
      console.log(selected)
      this.multipleSelection = selected
      this.$emit('onSelectionChange', selected)
    },
    tablePageSizeChange (size) {
      this.tablePageSize = size
      this.handleCurrentChange(1)
    },
    tablePageIndexChange (index) {
      this.tablePageIndex = index
      this.queryList()
    },
    tablesortChange (column, prop, order) {
      this.sortChange(column, prop, order)
    },
    sortChange (col) {
      if (col.order) {
        this.orderFields =
          col.order.indexOf('desc') !== -1
            ? { fieldName: col.prop, order: 'desc' }
            : { fieldName: col.prop, order: 'asc' }
      }
      this.queryList()
    },
    inBuildinType (col = {}) {
      const type = this.getAttr(col, 'type')
      return ['index', 'selection'].includes(type)
    },
    getAttr (col, key) {
      const val = col[key]
      if (typeof val === 'function' && !originTypes.includes(key)) {
        return val()
      }
      if (originTypes.includes(key)) {
        console.log(val)
      }
      return val || null
    },
    isType (col, type) {
      return (col.type || 'text') === type
    },
    isShow (btn, row) {
      const hide = btn.hide
      if (typeof hide === 'boolean') {
        return !hide
      } else if (typeof hide === 'function') {
        return !hide(row)
      }
      return true
    },
    getEvents (col, row, index) {
      const evt = col.events.onClick
      evt(row, index)
    },
    getVal (obj, col) {
      if (typeof col.formate === 'function') {
        return col.formate(obj[col.prop], obj)
      } else {
        return obj[col.prop]
      }
    },
    onAddBtnClick () {
      this.$emit('onAddBtnClick')
    },
    onDelBtnClick () {
      this.$emit('onDelBtnClick')
    },
    toggleChcecked () {
      this.$nextTick(() => {
        this.list.forEach(item => {
          console.log(this.selection, '12312312')
          if (this.selection.find(selId => selId == item[this.primaryKey])) {
            this.$refs.tbl.toggleRowSelection(item, true)
          }
        })
      })
    },
    clearSelect () {
      this.$refs.tbl.clearSelection()
    },
    handleDealSearchData (searchData = {}, column) {
      const obj = {
        filterFields: [],
        orderFields: []
      }
      if (Object.keys(searchData).length > 0) {
        for (const key in searchData) {
          column.forEach((item) => {
            if (item.prop === key) {
              if (item.conditionOperator && item.relationship && searchData[key]) {
                obj.filterFields = [...obj.filterFields, {
                  conditionOperator: item.conditionOperator,
                  fieldName: key,
                  relationship: item.relationship,
                  value: Array.isArray(searchData[key]) ? searchData[key] : [searchData[key]]
                }]
              }
              obj[key] = searchData[key]
            }
          })
        }
      } else {
        Object.assign(obj, {
          filterFields: [],
          orderFields: []
        })
      }
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.field-wrap {
  display: inline-block;
  &.link:hover {
    text-decoration: underline;
  }
}
.column-action {
  display: flex;
  > *:nth-child(n + 2) {
    margin-left: 10px;
  }
  .btn-item {
    ::v-deep i {
      vertical-align: -3px;
      font-size: 16px;
    }
    ::v-deep span {
      margin-left: 5px;
    }
  }
}
.right-setting {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  font-size: 16px;
}
</style>
