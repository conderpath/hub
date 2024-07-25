<template>
  <div :class="b('menu')">
    <div :class="b('left')" >
      <template v-if="vaildData(crud.tableOption.headerLeft,true)">
        <el-button type="primary"
                   @click="crud.rowAdd"
                   :icon="config.addBtnIcon"
                   :size="crud.isMediumSize"
                   v-permission="crud.getPermission('addBtn')"
                   v-if="vaildData(crud.tableOption.addBtn,config.addBtn)">
          <template v-if="!crud.isIconMenu">
            {{ crud.menuIcon('addBtn') }}
          </template>
        </el-button>
        <el-button type="primary"
                   @click="crud.rowCellAdd"
                   :icon="config.addBtnIcon"
                   v-permission="crud.getPermission('addRowBtn')"
                   :size="crud.isMediumSize"
                   v-if="vaildData(crud.tableOption.addRowBtn,config.addRowBtn)">
          <template v-if="!crud.isIconMenu">
            {{ crud.menuIcon('addBtn') }}
          </template>
        </el-button>
        <el-button type="primary"
                   @click="rowPrint"
                   :icon="config.printBtnIcon"
                   v-permission="crud.getPermission('printBtn')"
                   :size="crud.isMediumSize"
                   v-if="vaildData(crud.tableOption.printBtn,config.printBtn)">
          <template v-if="!crud.isIconMenu">
            {{ crud.menuIcon('printBtn') }}
          </template>
        </el-button>
        <el-button type="primary"
                   @click="rowExcel"
                   :icon="config.excelBtnIcon"
                   v-permission="crud.getPermission('excelBtn')"
                   :size="crud.isMediumSize"
                   v-if="vaildData(crud.tableOption.excelBtn,config.excelBtn)">
          <template v-if="!crud.isIconMenu">
            {{ crud.menuIcon('excelBtn') }}
          </template>
        </el-button>

        <template v-for="(menu,index) in vaildData(crud.tableOption.menuLeft,[])">
          <el-tooltip class="item" :disabled="vaildData(menu[menu.prop+'Tip'],vaildData(menu.btnTextShow,true))"
                      effect="dark" :content="vaildData(menu.btnText,'')"
                      placement="top">
            <el-button
                :key="index"
                v-if="vaildData(menu.show,true)"
                v-permission="crud.getPermission(menu.prop)"
                :type="vaildData(menu.type,'primary')"
                :icon="menu.icon"
                :size="crud.isMediumSize"
                :plain="vaildData(menu.plain,false)"
                :round="vaildData(menu.round,false)"
                :disabled="vaildData(menu.disabled,false)"
                @click.stop="()=>{menu.click && menu.click()}">
              {{ vaildData(menu.btnTextShow, true) ? vaildData(menu.btnText, '') : '' }}
            </el-button>
          </el-tooltip>
        </template>

        <template v-if="vaildData(crud.tableOption.menuComponentLeft)">
          <template v-for="(item,index) in vaildData(crud.tableOption.menuComponentLeft.menus,[])">
            <component  :is="crud.tableOption.menuComponentLeft.getComponent(item.component)"
                        v-if="vaildData(item.show,true)"
                        v-bind="item"
                        v-on="item.event">
              {{item.text}}
            </component>
          </template>
        </template>

        <slot name="menuLeft"
              :size="crud.isMediumSize"></slot>
      </template>

    </div>
    <div :class="b('right')" >
      <template  v-if="vaildData(crud.tableOption.headerRight,true)">
        <slot name="menuRight"
              :size="crud.isMediumSize"></slot>
        <ac-date type="datetimerange"
                 @change="dateChange"
                 value-format="yyyy-MM-dd HH:mm:ss"
                 format="yyyy-MM-dd HH:mm:ss"
                 :pickerOptions="pickerOptions"
                 style="display:inline-block;margin-right:20px;"
                 v-if="vaildData(crud.tableOption.dateBtn,config.dateBtn)"
                 :size="crud.isMediumSize"></ac-date>

        <el-popover placement="bottom-end" v-if="vaildData(crud.tableOption.columnBtn,true)" trigger="hover">
          <div class="column-list">
            <el-table :data="list" :max-height="240" :key="Math.random()" style="width: 220px;">
              <el-table-column prop="label" label="列名"></el-table-column>
              <template v-for="(item,index) in defaultColumn">
                <el-table-column :prop="item.prop" :key="index" header-align="center" align="center" :label="item.label">
                  <template slot-scope="{row}">
                    <el-checkbox  v-model="crud.objectOption[row.prop][item.prop]"
                                  @change="(val)=>handleHideChange(row.prop,item.prop,val)"></el-checkbox>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </div>
          <el-tooltip effect="dark"
                      slot="reference"
                      :content="$t('crud.showBtn')"
                      placement="top">
            <div class="set-column">
              <span class="ac-icon-icon-set-colomn iconfont"></span>
            </div>
          </el-tooltip>
        </el-popover>


        <el-tooltip effect="dark"
                    :content="$t('crud.searchBtn')"
                    v-if="(crud.$refs.headerSearch || {}).searchFlag&&vaildData(crud.tableOption.searchShowBtn,true)"
                    placement="top">
          <div class="hide-search"
               @click="crud.$refs.headerSearch.handleSearchShow()">
            <span class="ac-icon-icon-hide-search iconfont"></span>
          </div>
        </el-tooltip>
      </template>

    </div>
  </div>
</template>

<script>
import locale from "../../core/mixins/locale";
import permission from '../../core/directive/permission';
import create from "../../core/utils/create";
import config from "./config";
import {vaildData, getAsVal, arraySort} from "../../core/utils/utils";

export default create({
  name: "crud",
  mixins: [locale],
  directives: {
    permission
  },
  inject: ["crud"],
  data() {
    return {
      dateCreate: false,
      pickerOptions: {
        shortcuts: [{
          text: '今日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime());
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '昨日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      config: config,
      defaultColumn: [
        {
          label: this.t('crud.column.hide'),
          prop: 'hide',
          checkList: []
        },
        {
          label: this.t('crud.column.fixed'),
          prop: 'fixed'
        },
      ],
      hideCheckList: []
    };
  },
  created() {
    this.initFun();

  },
  computed: {
    list() {
      let list = [];
      for (let o in this.crud.objectOption) {
        const ele = this.crud.objectOption[o]
        if (ele.showColumn != false) {
          if (o === 'ALL') {
            list.unshift(Object.assign(ele, {prop: o}))
          } else {
            list.push(Object.assign(ele, {prop: o}))
          }
        }
      }
      list = arraySort(list, 'index', (a, b) => this.crud.objectOption[a.prop]?.index - this.crud.objectOption[b.prop]?.index)
      return list.filter((item) => (!item.hide || this.hideCheckList.includes(item.prop)));
    },
    data() {
      if (this.crud.tableOption.selection) {
        return this.crud.tableSelect;
      } else {
        return this.crud.list;
      }
    }
  },
  methods: {
    handleHideChange(prop,type, val) {
      if (type !== 'hide') return;
      if (val) {
        if (!this.hideCheckList.includes(prop)) {
          this.hideCheckList.push(prop)
        }
      } else {
        if (this.hideCheckList.includes(prop)) {
          this.hideCheckList = this.hideCheckList.filter((item) => item != prop)
        }
      }
    },
    //日期组件回调
    dateChange(val) {
      if (this.dateCreate) {
        this.crud.$emit("date-change", val);
      } else {
        this.dateCreate = true;
      }

    },
    initFun() {
      this.vaildData = vaildData;
      this.crud.rowExcel = this.rowExcel;
      this.crud.rowPrint = this.rowPrint;
    },
    rowExcel() {
      if (this.validatenull(this.data)) {
        this.$message.warning("请勾选要导出的数据");
        return;
      }
      this.$Export.excel({
        title: this.crud.tableOption.title,
        columns: this.crud.columnOption,
        data: this.handleSum()
      });
      this.crud.setCurrentRow();
    },
    //计算统计
    handleSum() {
      const option = this.crud.tableOption;
      const columnOption = this.crud.propOption;
      let count = 0;
      let sumsList = [...this.crud.sumsList];
      let data = []
      this.data.forEach(ele => {
        let obj = this.deepClone(ele);
        columnOption.forEach(column => {
          if (column.bind) {
            obj[column.prop] = getAsVal(obj, column.bind);
          }
          if (!this.validatenull(obj['$' + column.prop])) {
            obj[column.prop] = obj['$' + column.prop];
          }
        })
        data.push(obj);
      })
      if (option.index) count++;
      if (option.selection) count++;
      if (option.expand) count++;
      sumsList.splice(0, count);
      sumsList.splice(sumsList.length - 1, 1);
      if (option.showSummary) {
        let sumsObj = {};
        sumsList.forEach((ele, index) => {
          if ((columnOption[index] || {}).prop) {
            sumsObj[columnOption[index].prop] = ele;
          }
        });
        data.push(sumsObj);
      }
      return data;
    },
    //打印
    rowPrint() {
      this.$Print(this.crud.$refs.table)
    }
  }
});
</script>

<style scoped lang="less">
@import "../../core/style/variables.less";

.column-list {
  margin: -12px;

  /deep/ tbody tr td {
    border-bottom: none;
  }

  /deep/ tbody tr:hover {
    td {
      background-color: @background-theme-color;
    }
  }
}

.ac-crud__right {
  color: @theme-color;

  .set-column {
    margin-right: 12px;
  }

  .set-column, .hide-search {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    text-align: center;
    border: 1px solid #F9F0FF;
    background-color: @background-theme-color;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    span {
      font-size: 22px;
      position: relative;
      top: 2px;
    }
  }
}


</style>
