<template>
  <div class="page-basic-table">
    <div class="page_table">
      <el-table
        ref="tbl"
        :data="list"
        style="width: 100%"
        class="page_table_detail"
        :row-key="primaryKey"
        :align="align"
        @selection-change="handleSelect"
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
                        :icon="icons[btn.icon]"
                        @click="getEvents(btn,scope.row,scope.$index)"
                      >
                        {{ $t(`${btn.label}`) }}
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
import axios from 'axios'
import { localRead } from '@/utils/tools.js'
const originTypes = ['selectable']
export default {
  name: 'SearchTable',
  components: {
  },
  props: {
    searchApi: {
      type: String,
      required: true
    },
    countApi: {
      type:String,
      default: ''
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
    primaryKey:{
      default: 'id'
    },
    defaultSelected:{
      default() {
        return []
      }
    },
    reserveSelection:{
      type: Boolean,
      default:false
    },
    fields:{
      type: Array,
      default() {
        return []
      }
    }
  },
  data () {
    return {
      list: [],
      orderFields: { fieldName: 'createTime', order: 'desc' },
      multipleSelection: [],
      selection: [],
      selected: null,
      tablePageIndex: 1,
      tablePageSize: 10,
      tableTotal: 0,
      icons:{
        delete:'el-icon-delete',
        edit:'el-icon-edit-outline',
        disable:'el-icon-lock',
        enable:'el-icon-unlock',
        bind:'basic-icon-bind',
        column:'basic-icon-column',
        org:'basic-icon-tree',
        location:'basic-icon-location',
        calendar:'basic-icon-calendar'
      }
    }
  },
  computed:{
    selectFields() {
      let arr = []
      this.columns.forEach(item=>{
        if(item.prop) {
          arr.push(item.prop)
        }
      })
      return arr
    }
  },
  watch:{
    defaultSelected:{
      handler(val) {
        this.selection = [...val]
        this.selected = val && val.length?val[0]:null
      },
      deep: true,
      immediate: true
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    async queryList (pageNo) {
      if (!this.searchApi) return
      if (this.pagination && !this.countApi) return
      const filterFields = this.parseQueryParams(this.model)
      let data = { orderFields: [this.orderFields], selectFields:this.selectFields, filterFields: filterFields }
      if (this.pagination) {
        if (pageNo) {
          this.tablePageIndex = pageNo 
        }
        data.pageIndex = this.tablePageIndex - 1
        data.pageSize = this.tablePageSize
      }
      if (this.beforeSearchHook) {
        data = this.beforeSearchHook()
      }
      let arr = []
      const list = axios.post(this.searchApi, {
        token: localRead('token'),
        data: data
      })
      arr.push(list)
      if( this.pagination) {
        const count = axios.post(this.countApi, {
          token: localRead('token'),
          data: { filterFields: this.parseQueryParams(this.model) } 
        })
        arr.push(count)
      }
      const res = await axios.all(arr)
      if (res.length) {
        const res0 = res[0] && res[0].data || {}
        if(res0.code==='success') {
          this.list = res0.data || []
        }
        if(this.pagination) {
          const res1 = res[1] && res[1].data || {}
          if (res1.code === 'success') {
            this.tableTotal = res1.data||0
          }
        }
        if (this.afterSearchHook) {
          this.afterSearchHook(this.list)
        }
        if(this.selection.length) {
          this.toggleChcecked()
        }
      }
    },
    // 选择checkbox
    handleSelect (selected) {
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
    toggleChcecked() {
      this.$nextTick(() => {
        this.list.forEach(item => {
          if (this.selection.find(selId=>selId == item[this.primaryKey])) {
            this.$refs.tbl.toggleRowSelection(item, true)
          }
        })
      })
    },
    getOrderFields() {

    },
    parseQueryParams(data) {
      const arr = []
      // const opes = [...this.fields]
      for (const key in data) {
        if (data[key]) {
          let item = this.fields.find(field=>field.prop===key)||{}
          const obj = {
            conditionOperator: item.ope || '=',
            fieldName: key,
            relationship: item.rela|| 'AND',
            value: [data[key]]
          }
          arr.push(obj)
        }
      }
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.page_search_table_page {
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
}
.field-wrap{
  display: inline-block;
}
.column-action{
  display: flex;
  > *:nth-child(n + 2) {
    margin-left: 10px;
  }
  .btn-item{
    ::v-deep i{
      vertical-align: -3px;
      font-size: 16px;
    }
    ::v-deep span{
      margin-left: 5px;
    }
  }
}
</style>
