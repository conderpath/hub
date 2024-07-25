<template>
  <div :class="b({'card':tableOption.shadow ? false : !tableOption.card, 'hide-search': $refs.headerSearch && !$refs.headerSearch.searchShow})" class="table-list-container">
    <ac-header-search ref="headerSearch" :search="search">
      <template slot="searchMenu" slot-scope="scope">
        <slot name="searchMenu" v-bind="scope" />
      </template>
      <template v-for="item in searchSlot" :slot="item.prop" slot-scope="scope">
        <slot v-bind="scope" :name="getSlotName(item,'S')" />
      </template>
    </ac-header-search>

    <el-divider v-if="validData(tableOption.dividerShow,true) && !tableOption.card" />

    <el-card :shadow="isShadow">
      <div class="table-list">
        <!--header-menu-->
        <ac-header-menu v-show="validData(tableOption.header,true)">
          <template slot="headerMenu" slot-scope="scope">
            <slot name="headerMenu" />
          </template>
        </ac-header-menu>
        <div class="table-box">
          <!--tips-->
          <el-tag v-if="validData(tableOption.tip,true) && tableOption.selection" class="ac-crud__tip">
            <div class="ac-tip-box">
              <div class="left">
                <slot name="tipLeft" />
                <i class="el-icon-warning-outline"></i>
                <span class="ac-crud__tip-name">
                  {{ $t('crud.tipStartTitle') }}
                  <span class="ac-crud__tip-count">{{ selectLen }}</span>
                  {{ $t('crud.tipEndTitle') }}
                </span>
              </div>
              <div class="right">
                <slot name="tipRight" />
                <el-button
                  v-if="vaildData(tableOption.selectClearBtn,true) && tableOption.selection"
                  v-permission="getPermission('selectClearBtn')"
                  type="text"
                  size="small"
                  @click="selectClear"
                >
                  {{ $t('crud.emptyBtn') }}
                </el-button>
              </div>
            </div>
          </el-tag>
          <el-table
            ref="table"
            v-loading="tableLoading"
            :class="validData(tableOption.stripe,true) ? 'row-no-bottom-border':''"
            :data="data"
            :row-key="handleGetRowKeys"
            :border="tableOption.border"
            :stripe="validData(tableOption.stripe,true)"
            tooltip-effect="dark"
            :highlight-current-row="tableOption.highlightCurrentRow"
            :row-class-name="rowClassName"
            @current-change="currentRowChange"
            @selection-change="selectionChange"
            @select="select"
            @select-all="selectAll"
            @sort-change="sortChange"
          >
            <!-- 选择框 -->
            <el-table-column
              v-if="tableOption.selection"
              :fixed="validData(tableOption.selectionFixed,'left')"
              type="selection"
              :selectable="tableOption.selectable"
              :reserve-selection="validData(tableOption.reserveSelection,true)"
              :width="tableOption.selectionWidth || 50"
              align="center"
            />
            <!-- 序号 -->
            <el-table-column
              v-if="validData(tableOption.index)"
              :fixed="validData(tableOption.indexFixed,'left')"
              :label="tableOption.indexLabel || '#'"
              type="index"
              :width="tableOption.indexWidth || 50"
              :index="indexMethod"
              align="center"
            />

            <template v-for="(column,index) in tableOption.column">
              <el-table-column
                v-if="!validData(column.hide,false)"
                :key="column.prop+index"
                :prop="column.prop"
                :width="column.width ? column.width:''"
                :show-overflow-tooltip="column.overHidden"
                :label="column.label"
              >
                <template slot-scope="{row,$index}">
                  <slot v-if="$scopedSlots[column.prop]" :name="column.prop" :row="row" :index="$index" />
                  <!-- 单选按钮 -->
                  <el-radio
                    v-else-if="validData(tableOption.singleSelectionRadio, true) && column.type === 'singleSelection' && !tableOption.selection"
                    v-model="selected"
                    :label="row"
                  >
                    {{ '' }}
                  </el-radio>
                  <span v-else-if="column.type === 'select'">{{ selectLabel(column,row[column.prop]) }}</span>

                  <span v-else>{{ column.formatter && column.formatter(row[column.prop],row) || row[column.prop] }}</span>
                </template>
              </el-table-column>
            </template>

            <!-- 操作栏 -->
            <el-table-column
              v-if="validData(tableOption.menu,true)"
              class="menu-btn"
              prop="menu"
              :fixed="validData(tableOption.menuFixed,'right')"
              :label="tableOption.menuTitle || $t('crud.menu')"
              :align="tableOption.menuAlign || 'left'"
              :header-align="tableOption.menuHeaderAlign || 'left'"
              :width="tableOption.menuWidth || 240"
            >
              <template slot-scope="{row,$index}">
                <el-tooltip class="item" :disabled="validData(tableOption.viewBtnTip,false)" effect="dark" :content="validData(tableOption.viewBtnText,$t('crud.viewBtn'))" placement="top">
                  <el-button
                    v-if="validData(tableOption.viewBtn,true)"
                    v-permission="getPermission('viewBtn',row,$index)"
                    type="text"
                    icon="el-icon-view"
                    :size="controlSize"
                    @click.stop="rowView(row,$index)"
                  >
                  </el-button>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  :disabled="validData(tableOption.editBtnTip,false)"
                  effect="dark"
                  :content="validData(tableOption.viewBtnText,$t('crud.editBtn'))"
                  placement="top"
                >
                  <el-button
                    v-if="validData(tableOption.editBtn,true)"
                    v-permission="getPermission('editBtn',row,$index)"
                    type="text"
                    icon="el-icon-edit"
                    :size="controlSize"
                    @click.stop="rowEdit(row,$index)"
                  >
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  :disabled="validData(tableOption.delBtnTip,false)"
                  effect="dark"
                  :content="validData(tableOption.viewBtnText,$t('crud.delBtn'))"
                  placement="top"
                >
                  <el-button
                    v-if="validData(tableOption.delBtn,true)"
                    v-permission="getPermission('delBtn',row,$index)"
                    type="text"
                    icon="el-icon-delete"
                    :size="controlSize"
                    @click.stop="rowDel(row,$index)"
                  >
                  </el-button>
                </el-tooltip>

                <template v-for="(menu,index) in validData(tableOption.menus,[])">
                  <el-tooltip
                    :key="menu.prop"
                    class="item"
                    :disabled="validData(menu[menu.prop+'Tip'],validData(menu.btnTextShow,false))"
                    effect="dark"
                    :content="validData(menu.btnText,'')"
                    placement="top"
                  >
                    <el-button
                      v-if="validData(menu.show,true)"
                      :key="index"
                      v-permission="getPermission(menu.prop,row,$index)"
                      :type="validData(menu.type,'text')"
                      :icon="menu.icon"
                      :size="controlSize"
                      @click.stop="()=>{menu.click && menu.click(row,$index)}"
                    >
                      {{ validData(menu.btnTextShow,false) ? validData(menu.btnText,''):'' }}
                    </el-button>
                  </el-tooltip>
                </template>
                <el-popover v-if="validData(tableOption.moreMenus,false)" placement="bottom-end" popper-class="ac-popover">
                  <template v-for="(menu,index) in validData(tableOption.moreMenus,[])">
                    <el-tooltip
                      :key="menu.prop"
                      class="item"
                      :disabled="validData(menu[menu.prop+'Tip'],validData(menu.btnTextShow,false))"
                      effect="dark"
                      :content="validData(menu.btnText,'')"
                      placement="top"
                    >
                      <div class="more-menu-item">
                        <el-button
                          v-if="validData(menu.show,true)"
                          :key="index"
                          v-permission="getPermission(menu.prop,row,$index)"
                          :type="validData(menu.type,'text')"
                          :icon="menu.icon"
                          :size="controlSize"
                          @click.stop="()=>{menu.click && menu.click(row,$index)}"
                        >
                          {{ validData(menu.btnTextShow,false) ? validData(menu.btnText,''):'' }}
                        </el-button>
                      </div>
                    </el-tooltip>
                  </template>
                  <el-button slot="reference" type="text" icon="el-icon-more">
                  </el-button>
                </el-popover>
                <slot name="menu" :row="row" :size="controlSize" :index="$index" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <ac-pagination
          ref="tablePage"
          :page="page"
        >
          <template slot="page">
            <slot name="page" />
          </template>
        </ac-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import create from '../../core/utils/create'
import acHeaderSearch from './header-search'
import acHeaderMenu from './header-menu'
import common from "../../core/mixins/common";
import {deepClone, validData} from "../../core/utils/utils";
import permission from "../../core/directive/permission";
import acPagination from './table-pagination'

export default create({
  name: 'page-table',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    option: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    search: {
      type: Object,
      default () {
        return {};
      }
    },
    page: {
      type: Object,
      default () {
        return {};
      }
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    permission: {
      type: [Function, Object],
      default: () => {
        return {};
      }
    },
    rowClassName: {
      type: [Function, String],
      default: undefined
    }
  },
  mixins:[common],
  provide () {
    return {
      acPageTable: this
    };
  },
  directives: {
    permission
  },
  filter: {

  },
  components:{
    acHeaderSearch,
    acPagination,
    acHeaderMenu
  },
  data () {
    return {
      tableOption: {},
      columnFormOption:[],
      tableSelect: [],
      selected:'',
      objectOption:{}
    }
  },
  computed:{
    searchSlot () {
      return this.columnFormOption.filter(ele => this.$scopedSlots[`${ele.prop}Search`])
    },
    controlSize () {
      return this.tableOption.size || 'small';
    },
    selectLen () {
      return this.tableSelect ? this.tableSelect.length : 0;
    },
    rowKey () {
      return this.tableOption.rowKey || "id";
    },
    isShadow () {
      return this.tableOption.shadow ? 'always' : 'never'
    },
  },
  watch: {
    option: {
      handler () {
        this.init()
      },
      deep: true
    }
  },

  created () {
    this.init()
  },
  methods: {
    selectLabel({dicData=[]},value){
      let label = ''
      if (Array.isArray(value)) {
        let filterArray = dicData.filter((item) => {
          return value.includes(item.value)
        })
        filterArray.forEach((item,index)=>{
          if (index == 0){
            label = item.label
          }else {
            label = label + ' | ' + item.label
          }

        })
      } else {
        dicData.forEach((item) => {
          if (item.value == value) {
            label = item.label
          }
        })
      }
      return label
    },
    handleGetRowKeys (row) {
      const rowKey = row[this.rowKey];
      return rowKey;
    },
    selectClear () {
      this.$refs.table.clearSelection();
    },
    validData,
    init () {
      this.tableOption = this.option
      this.columnFormOption = this.option.column
      this.objectOption = {};
      this.tableOption.column.forEach(ele => this.objectOption[ele.prop] = ele);
    },
    rowAdd () {
      this.$emit('row-add');
    },
    indexMethod (index) {
      return (
          index + 1 +
          ((this.page.currentPage || 1) - 1) *
          (this.page.pageSize || 10)
      );
    },
    // 选择回调
    selectionChange (val) {
      this.tableSelect = val;
      this.$emit("selection-change", val);
    },
    //设置单选
    currentRowChange (currentRow, oldCurrentRow) {
      this.selected = currentRow
      this.$emit("current-row-change", currentRow, oldCurrentRow);
    },
    setCurrentRow (row) {
      this.selected = row
      this.$refs.table.setCurrentRow(row);
    },
    // 单个选择回调
    select (selection, row) {
      this.$emit("select", selection, row);
    },
    // 点击勾选全选 Checkbox
    selectAll (selection) {
      this.$emit("select-all", selection);
    },
    //筛选回调用
    filterChange (filters) {
      this.$emit("filter-change", filters);
    },
    // 排序回调
    sortChange (val) {
      this.$emit("sort-change", val);
    },
    getPermission (key, row, index) {
      if (typeof this.permission === "function") {
        return this.permission(key, row, index)
      } else if (!this.validatenull(this.permission[key])) {
        return this.permission[key]
      } else {
        return true;
      }
    },
    // 编辑
    rowEdit (row, index) {
      let rowData = deepClone(row);
      this.$emit("row-edit", rowData,index);
    },
    //查看
    rowView (row, index) {
      let rowData = deepClone(row);
      this.$emit("row-view", rowData,index);
    },
    //查看
    rowDel (row, index) {
      let rowData = deepClone(row);
      this.$emit("row-del", rowData,index);
    },
    // 选中实例
    toggleSelection (rows,select = null) {
      if (rows && rows.length > 0) {
        rows.forEach(row => {
          select !== null ? this.$refs.table.toggleRowSelection(row, select) :
              this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
  }

})
</script>

<style scoped lang="less">
.table-list-container {
  background-color: #f0f2f5;
  /deep/.el-card+.el-card {
    margin-top: 8px;
  }
  /deep/.el-table th{
    /* padding: 15px 8px;*/
    background-color: #fafafa;
  }
  .row-no-bottom-border{
    /deep/tbody tr td{
      border-bottom: none;
    }
  }


  /deep/.hover-row{
    td{
      background-color: #F9F0FF !important;
    }
  }
  /deep/
  .el-table__body tr:hover > td{
    background-color: #F9F0FF !important;
  }
  /deep/.el-divider--horizontal{
    margin:0 !important;
  }

  .table-list{
    .table-box{
      /deep/.el-button{
        i{
          font-size: 16px;
        }
        .el-icon-delete{
          color: #FF3246;
        }
      }
    }
    .header-menu{
      margin-bottom: 10px;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
    }
    .ac-crud__tip{
      margin:8px 0;
      display: flex;
      align-items: center;
      font-size: 12px;
      &-name{
        margin-right: 10px;
         color: rgba(0, 0, 0, 0.65);
      }
      &-count{
        font-size: 16px;
        font-weight: 600;
      }
      .el-button{
        margin-bottom: 0;
      }
      .ac-tip-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .left{
          .el-icon-warning-outline{
            margin-right: 6px;
          }
        }
      }

    }
  }



}
.ac-page-table--card{
  .el-card {
    border: none;
    margin-top: 0;
    border-radius: 0;
  }
  /deep/.el-card+.el-card {
    margin-top: 0;
  }
}
.more-menu-item{
  margin: 0 -12px;
  padding-left: 22px;
  &:hover{
    background: #F9F0FF;
  }
}
.ac-page-table--hide-search{
  /deep/.el-card+.el-card {
    margin-top: 0;
  }
}
</style>
