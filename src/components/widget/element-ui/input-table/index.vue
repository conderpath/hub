<template>
  <div
    :class="b()"
    class="index-container"
    @mouseenter="handleEnter"
    @mouseout="handleOut"
  >
    <el-autocomplete
      :class="b('autocomplete')"
      :size="size"
      :clearable="disabled?false:clearable"
      :value="labelShow"
      :fetch-suggestions="handleFetchSuggestions"
      :placeholder="placeholder"
      :readonly="!remote || multiple"
      :value-key="nameKey"
      :trigger-on-focus="triggerOnFocus"
      @select="HandleSelect"
    >
      <i v-show="labelShow" slot="suffix" class="el-icon-circle-close el-input__icon" @click="handleIconClick"/>
      <el-button
        slot="append"
        :disabled="disabled"
        icon="el-icon-search"
        @click="handleShow"
      />
    </el-autocomplete>

    <el-dialog
      class="ac-dialog"
      :width="dialogWidth"
      append-to-body
      :title="placeholder"
      :before-close="handleClear"
      :visible.sync="box"
    >
      <ac-crud
        ref="crud"
        v-loading="loading"
        :option="option"
        :data="data"
        :page.sync="page"
        :search.sync="searchData"
        @on-load="onList"
        @selection-change="handleSelectionChange"
        @current-row-change="handleCurrentRowChange"
        @search-change="handleSearchChange"
        @search-reset="handleSearchChange">

        <template v-for="item in mainSlot"
                  slot-scope="scope"
                  :slot="item.prop">
          <slot v-bind="scope"
                :name="item.prop"></slot>
        </template>

      </ac-crud>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :size="size"
          icon="el-icon-check"
          :disabled="!(data.length > 0)"
          @click="setVal"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import create from '../../core/utils/create'
import {DIC_PROPS} from '../../core/utils/variable'
import {deepClone, sendRequest, validatenull} from "../../core/utils/utils";

export default create({
  name: "input-table",
  props: {
    fetchSuggestions: Function,
    onLoad: Function,
    remoteFormatter: Function,
    remoteBeforeSearch: Function,
    change: Function,
    inputFormatter: Function,
    allowSelect: Function,
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    triggerOnFocus: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '60%'
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      /*      type:[Array,Object,String] ,
            default:()=>{
              return null
            }*/
    },
    column: {
      type: Object,
      default: () => {
        return {}
      }
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    },
    remote: {
      type: Boolean,
      default: false,
    },
    remoteUrl: {
      type: String
    },
    remoteMethod: {
      type: String,
      default: 'get'
    },
    remoteQuery: {
      type: Object,
      default: () => {
        return {}
      }
    },
    remoteHeader: {
      type: Object,
      default: () => {
        return {}
      }
    },
    row:{
      type: Object,
      default: () => {
        return {}
      }
    },
    index:{
      type: Number,
      default: null
    },
    allowInit:{
      type: Boolean,
      default: true
    },
    searchIncludeKey:{
      type:Array,
      default: () => {
        return []
      }
    }
  },
  mixins: [],
  data() {
    return {
      text: null,
      page: {},
      loading: false,
      box: false,
      created: false,
      showIconClose: false,
      data: [],
      searchData: {},
      selectDataList: [],
      selectCurrentDataList: [],
      currentData: null,
      selectCurrentData: null,
      propsDefault: DIC_PROPS
    }
  },
  computed: {
    multiple() {
      return this.column.children && this.column.children.selection || false
    },
    nameKey() {
      return this.props.label || this.propsDefault.label
    },
    valueKey() {
      return this.props.value || this.propsDefault.value
    },
    remoteKey() {
      return this.props.remoteKey || 'value'
    },
    labelShow() {
      if(this.inputFormatter) {
        return this.inputFormatter({ instance:this, index: this.index})
      }else if (this.multiple) {
        return this.selectDataList.length > 0 ? `共 ${this.selectDataList.length} 条` : ''
      } else {
        let labelKeyList = this.nameKey.split('.')
        let label = this.currentData
        if (validatenull(label)) return  '';
        for (let n = 0; n < labelKeyList.length; n++) {
          label = label[labelKeyList[n]]
        }
        return label || ''
      }
    },
    option() {
      return Object.assign({
        menu: false,
        header: false,
        size: 'mini',
        highlightCurrentRow: !this.multiple,
        page: this.allowInit
      }, this.column.children)
    },
    columnOption(){
      let list = [];
      this.column.children && this.column.children.column.forEach((col)=>{
        list.push(col)
      })
      return list
    },
    mainSlot () {
      return this.columnOption.filter(ele => this.$scopedSlots[ele.prop])
    },
  },
  watch: {
    text: {
      handler(val) {
        if (this.created || validatenull(val)) return
        if (typeof this.onLoad == 'function') {
          if (typeof val == 'string') {
            if (typeof this.onLoad == 'function') {
              this.onLoad({value: this.text}, data => {
                if (data && !validatenull(data)) {
                  this.currentData = data
                  this.created = true;
                }
              })
            }
          } else if (Array.isArray(val) && val.length > 0) {
            this.selectDataList = val
          }
        }
      },

    },
    value: {
      handler(val,oldVal) {
        if (validatenull(val)) {
          this.currentData = {}
          this.selectDataList = []
          this.$refs.crud && this.$refs.crud.setCurrentRow({})
          return;
        }
        if (this.created || validatenull(val)) return;
        if (typeof val == 'string') {
          if (typeof this.onLoad == 'function') {
            this.onLoad({value: val,index:this.index,row:this.row}, data => {
              if (data && !validatenull(data)) {
                this.currentData = data
                this.created = true;
                if (this.$refs.crud && this.$refs.crud.dicInit){
                  this.$refs.crud.dicInit('cascader')
                }
              }
            })
          }
        } else if (Array.isArray(val) && val.length > 0) {
          this.selectDataList = val
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initValue() {
      this.text = this.value
    },
    handleEnter() {
      this.showIconClose = true
    },
    handleOut() {
      this.showIconClose = false
    },
    onList() {
      this.loading = true;
      if (typeof this.onLoad == 'function') {
        this.onLoad({page: this.page, searchData: this.searchData, index: this.index}, data => {
          this.page.total = data.total;
          this.data = data.data
          this.loading = false;
          this.selectActiveStatus(this.data)
          if (this.$refs.crud && this.$refs.crud.dicInit){
            this.$refs.crud.dicInit('cascader')
          }

        })
      }
    },

    selectActiveStatus(data = []) {
      this.$nextTick(() => {
        if (this.multiple) {
          this.$refs.crud.toggleSelection()
          let selectDataList = data.filter((item) => {
            let list = this.value || []
            return list.includes(item[this.valueKey])
          })
          this.$refs.crud.toggleSelection(selectDataList, true)
        } else {
          let active = data.find(ele => ele[this.valueKey] == this.value)
          if(active) {
            this.$refs.crud.setCurrentRow(active);
          }
        }
      })
    },

    handleSearchChange(form, done) {
      if (typeof this.onLoad == 'function') {
        const onLoad = ()=>{
          this.onLoad({page: this.page, searchData: form}, data => {
            this.page.total = data.total;
            this.data = data.data;
            this.selectActiveStatus(this.data)
          })
        }
        if (this.searchIncludeKey.length > 0){
          if (!this.searchIncludeKey.some((key)=>{return validatenull(form[key])})){
            onLoad()
          }
        }else {
          onLoad()
        }
      }
      done && done()
    },
    handleFetchSuggestions(queryString, cb) {
      if (typeof this.fetchSuggestions === 'function') {
        this.fetchSuggestions(queryString, cb)
        return
      }

      let query = Object.assign({[this.remoteKey]: queryString}, this.remoteQuery)
      if (typeof this.remoteBeforeSearch === 'function') {
        query = this.remoteBeforeSearch(queryString)
      }

      sendRequest({
        url: this.remoteUrl,
        method: this.remoteMethod,
        query: query,
        headers: this.remoteHeader,
        formatter: this.remoteFormatter,
      }).then((res) => {
        cb(res);
      })
    },
    HandleSelect(data) {
      this.$emit("input", data[this.valueKey]);
      this.$emit("change", data[this.valueKey]);
      if (typeof this.change == 'function') {
        this.change(data)
      }
    },
    handleCurrentRowChange(currentRow) {
      if (this.multiple) return;
      this.selectCurrentData = currentRow
    },
    handleClear() {
      // 没有记录时，清空选中行
      if(!this.labelShow) {
        this.$refs.crud.setCurrentRow({})
      }
      this.box = false
    },
    handleShow() {
      if (this.disabled || this.readonly) return;
      this.box = true;
      if (!this.allowInit)  return;
      this.$nextTick(() => {
        if (!this.loading){
          this.onList()
        }

      })

    },
    handleSelectionChange(val) {
      this.selectCurrentDataList = val
      this.selectDataList = this.selectCurrentDataList.map((item) => item[this.valueKey])
    },
    handleIconClick() {
      // 取消时，清空选中行
      this.$refs.crud && this.$refs.crud.setCurrentRow({})
      this.selectCurrentData = {}
      this.selectDataList = []
      this.setVal()
    },

    setVal() {
      let set = ()=>{
        this.currentData = deepClone(this.selectCurrentData)
        let data = this.multiple ? this.selectDataList : this.currentData[this.valueKey]
        this.$emit("input", data);
        this.$emit("change", data);
        if (typeof this.change == 'function') {
          let obj = {value:data,selectedRow: this.multiple ? this.selectCurrentDataList : this.currentData,}
          this.vaildData(this.row) ? Object.assign(obj,{row:this.row,index: this.index}):''
          this.change(obj)
        }
        this.box = false
      }
      if (typeof this.allowSelect === 'function'){
        let currentData = deepClone(this.selectCurrentData)
        let data = this.multiple ? this.selectDataList : currentData[this.valueKey]
        let obj = {value:data,selectedRow: this.multiple ? this.selectCurrentDataList : currentData,}
        this.vaildData(this.row) ? Object.assign(obj,{row:this.row,index: this.index}):''
        this.allowSelect(set,obj)
      }else {
        set()
      }
    }
  }
})
</script>

<style scoped lang="less">
.index-container {
  .el-autocomplete{
    display: block;
    width: 100%;
  }

  .el-icon-circle-close {
    cursor: pointer;
  }

}

/deep/.el-table__empty-block{
  width: 100% !important;
}
</style>
