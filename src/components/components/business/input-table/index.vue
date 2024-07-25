<template>
  <div
      :class="b()"
      class="index-container"
  >
    <ac-input-table
        v-model="inputValue"
        v-bind="attr"
        @change="handleChange"
    />
  </div>
</template>

<script>
import create from '../../core/utils/create'
import * as bName from './options'
import {apiDataRequest} from "../../core/utils/apiDataRequest";
import {dataCommonInsert} from "../../../../api/apiCommonInsert";

export default create({
  name: "b-input-table",
  props: {
    change: Function,
    businessType: {
      type: String, // bank
      required: true
    },
    value: {
      type: [Array, String],
      default: () => {
        return null
      }
    },
    currentValueRow: {
      type: [Object, Function],
      default: () => {
        return null
      }
    },
    props: {
      type: Object,
      default() {
        return null
      }
    },
    index:{
      type: Number,
      default: null
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    beforeSearch: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      type: '',
      inputValue: '',
      ...bName
    }
  },
  computed: {
    attr() {
      return {
        ...this[this.businessType],
        props: this.props || this[this.businessType].props,
        index: this.index,
        row: this.row,
        disabled: this.disabled,
        onLoad: ({value, page, searchData}, cb) => {
          if (value) {
            if(typeof this.currentValueRow === 'function') {
              cb(this.currentValueRow({row: this.row, index: this.index}))
            }else {
              cb(this.currentValueRow)
            }
          } else {
            if (this[this.businessType].countApi) {
              const {countApi, listApi, column} = this[this.businessType]
              this.getDataList(listApi, countApi, page, searchData, cb, column.children.column)
            } else {
              this.getList(this[this.businessType].listApi, this[this.businessType].afterSearch, page, searchData, cb)
            }
          }
        },
        change: ({selectedRow, index, row, value}) => {
          if (typeof this.change == 'function') {
            this.change({selectedRow, index, row, value})
          }
        }
      }
    },
  },
  watch: {
    value: {
      handler(val) {
        this.inputValue = val
      },
      immediate: true,
      deep: true
    },
    businessType: {
      handler(val) {
        this.type = val
      },
      immediate: true,
      deep: true
    }
  },
  created() {

  },
  methods: {
    handleChange(data) {
      this.$emit("input", data);
      this.$emit("change", data);
    },
    getList(listApi, afterSearch, page = {}, searchData = {}, cb) {
      if (!listApi) {
        this.$message.error('缺少接口api')
        return
      }
      Object.assign(searchData, {state: 0, pageNo: page.currentPage, pageSize: page.pageSize})
      apiDataRequest.request({
        api: listApi,
        method: 'post',
        data: this.beforeSearch ? this.beforeSearch(searchData) : searchData
      }).then((res) => {
        let result = res.data;
        cb({total: result.total, data: afterSearch && afterSearch(result.list) || result.list})
      })
    },
    async getDataList(queryApi, countApi, page, searchData, cb, column) {
      if (!queryApi) return
      let originData = this.handleDealSearchData(searchData, column, page)
      let postData = this.beforeSearch ? this.beforeSearch(originData) : originData
      const res = await apiDataRequest.request({
        api: queryApi,
        method: 'post',
        data: dataCommonInsert(postData)
      })
      const resCount = await apiDataRequest.request({
        api: countApi,
        method: 'post',
        data: dataCommonInsert(postData)
      })
      cb && cb({
        total: resCount.data || 0,
        data: res.data || []
      })
    },
    handleDealSearchData(searchData = {}, column, page = {}) {
      const {pageSize, currentPage} = page
      const obj = {
        filterFields: [],
        orderFields: [],
        pageSize: pageSize,
        pageIndex: currentPage - 1
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
})
</script>

<style scoped lang="less">
.index-container {
  display: inline-block;
  width: 100%!important;
}
</style>
