<template>
  <div>
    <slot name="header"></slot>
    <!-- 动态列 -->
    <template v-for="(column,index) in list">
      <column-dynamic v-if="column.children && column.children.length>0"
                      :columnOption="column"
                      :key="column.label">
        <template v-for="item in crud.mainSlot"
                  slot-scope="scope"
                  :slot="item.prop">
          <slot v-bind="scope"
                :name="item.prop"></slot>
        </template>
        <template v-for="item in crud.headerSlot"
                  slot-scope="scope"
                  :slot="crud.getSlotName(item,'H')">
          <slot v-bind="scope"
                :name="crud.getSlotName(item,'H')"></slot>
        </template>
        <template v-for="item in crud.formSlot"
                  slot-scope="scope"
                  :slot="crud.getSlotName(item,'F')">
          <slot v-bind="scope"
                :name="crud.getSlotName(item,'F')"></slot>
        </template>
      </column-dynamic>
      <el-table-column v-else-if="getColumnProp(column,'hide') &&  (crud.$refs.headerMenu ? !crud.$refs.headerMenu.hideCheckList.includes(column.prop):true)"
                       :key="column.prop"
                       :prop="column.prop"
                       :label="column.label"
                       filter-placement="bottom-end"
                       :filters="getColumnProp(column,'filters')"
                       :filter-method="getColumnProp(column,'filterMethod')?handleFiltersMethod:undefined"
                       :filter-multiple="vaildData(column.filterMultiple,true)"
                       :show-overflow-tooltip="column.overHidden"
                       :min-width="column.minWidth"
                       :sortable="getColumnProp(column,'sortable')"
                       :render-header="column.renderHeader"
                       :align="column.align || crud.tableOption.align"
                       :header-align="column.headerAlign || crud.tableOption.headerAlign"
                       :width="getColumnProp(column,'width')"
                       :fixed="getColumnProp(column,'fixed')">
        <template slot="header"
                  slot-scope="scope">
          <slot :name="crud.getSlotName(column,'H')"
                v-if="crud.$scopedSlots[crud.getSlotName(column,'H')]"
                v-bind="Object.assign(scope,{column})"></slot>
          <el-popover placement="bottom"
                      v-else
                      :disabled="(crud.objectOption[column.prop] || {}).screen!==true"
                      trigger="hover">
            <el-input type="text"
                      :placeholder="`请输入 ${column.label} 筛选关键字`"
                      v-model="(crud.objectOption[column.prop] || {}).screenValue"
                      size="mini"></el-input>
            <span slot="reference">{{column.label}}</span>
          </el-popover>
        </template>
        <template slot-scope="{row,$index}">
          <el-form-item :prop="crud.isTree?'':`list.${$index}.${column.prop}`"
                        :label="vaildLabel(column,row,' ')"
                        v-if="row.$cellEdit && column.cell"
                        :label-width="vaildLabel(column,row,'1px')"
                        :rules="(typeof column.rules == 'function') ? column.rules(row,$index):column.rules">
            <slot v-bind="{
                      row:row,
                      dic:crud.DIC[column.prop],
                      size:crud.isMediumSize,
                      index:$index,
                      disabled:crud.btnDisabledList[$index],
                      label:handleShowLabel(row,column,crud.DIC[column.prop]),
                      '$cell':row.$cellEdit
                    }"
                  :name="crud.getSlotName(column,'F')"
                  v-if="crud.$scopedSlots[crud.getSlotName(column,'F')]"></slot>
            <form-temp v-else
                       :column="column"
                       :size="crud.isMediumSize"
                       :dic="(crud.cascaderDIC[$index] || {})[column.prop] || crud.DIC[column.prop]"
                       :props="column.props || crud.tableOption.props"
                       :readonly="column.readonly"
                       :disabled="crud.disabled || crud.tableOption.disabled || column.disabled  || (column.disabledCallBack && column.disabledCallBack(row,column)) || crud.btnDisabledList[$index]"
                       :clearable="vaildData(column.clearable,false)"
                       v-bind="$uploadFun(column,crud)"
                       v-model="row[column.prop]"
                       :row="row"
                       :index ="$index"
                       @change="columnChange($index,row,column)">
            </form-temp>
          </el-form-item>
          <slot :row="row"
                :index="$index"
                :dic="crud.DIC[column.prop]"
                :size="crud.isMediumSize"
                :label="handleShowLabel(row,column,crud.DIC[column.prop])"
                :name="column.prop"
                v-else-if="crud.$scopedSlots[column.prop]"></slot>

          <component  :is="column.getComponent(column.componentName)"
                      v-else-if="vaildData(column.componentName,'')"
                      v-bind="Object.assign(column)"
                      :row="row"
                      :column="column"
                      :index="$index"
                      :value="row[column.prop]"
                      :size="crud.isMediumSize"
                      v-on="column.event">
          </component>

          <template v-else>
            <span v-if="['img','upload'].includes(column.type)">
              <div class="ac-crud__img">
                <img v-for="(item,index) in getImgList(row,column)"
                     :src="item"
                     :key="index"
                     @click="openImg(getImgList(row,column),index)" />
              </div>
            </span>
            <span v-else-if="['url'].includes(column.type)">
              <el-link v-for="(item,index) in corArray(row[column.prop],column.separator)"
                       type="primary"
                       :key="index"
                       :href="item"
                       :target="column.target || '_blank'">{{item}}</el-link>
            </span>
            <span v-else-if="['rate'].includes(column.type)">
              <ac-rate disabled v-model="row[column.prop]" />
            </span>
            <span v-else-if="['link'].includes(column.type)">
              <a v-model="row[column.prop]" href="javascript:void(0)" @click="column.linkClick ? column.linkClick(row, index, column,row[column.prop]):()=>{}" v-html="handleDetail(row,column)">
              </a>
            </span>
            <span v-else v-html="handleDetail(row,column)"></span>
          </template>
        </template>
      </el-table-column>
    </template>
    <slot name="footer"></slot>
  </div>

</template>

<script>

import create from "../../core/utils/create";
import { detail } from "../../core/utils/detail";
import { sendDic } from "../../core/utils/dic";
import { DIC_PROPS, DIC_SPLIT } from '../../core/utils/variable'
import columnDynamic from "./column-dynamic";
import formTemp from '../components/form/index'
import { arraySort } from '../../core/utils/utils'
let count = {}
export default create({
  name: "crud",
  data () {
    return {
      count: {},
      currentRowData:''
    }
  },
  components: {
    formTemp,
    columnDynamic
  },
  inject: ["crud"],
  provide () {
    return {
      crud: this.crud,
      dynamic: this
    };
  },
  props: {
    columnOption: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    list () {
      let result = [...this.columnOption];
      result = arraySort(result, 'order', (a, b) => this.crud.objectOption[a.prop]?.order - this.crud.objectOption[b.prop]?.order)
      return result;
    }
  },
  methods: {
    getColumnProp (column, type) {
      let obj = this.crud.objectOption[column.prop] || {}
      if (type === 'filterMethod') return obj?.filters
      if (this.crud.isMobile && ['fixed'].includes(type)) return false;
      let result = obj?.[type]
      if (type == 'width' && result == 0) { return undefined }
      if (type == 'filters') return this.handleFilters(column, result)
      if (type == 'hide') return column.hide !== true
      else return result;
    },
    vaildLabel (column, row, val) {
      if (column.rules && row.$cellEdit) {
        return val
      }
    },
    corArray (list, separator = DIC_SPLIT) {
      if (this.validatenull(list)) {
        return []
      } else if (!Array.isArray(list)) {
        return list.split(separator);
      }
      return list
    },
    getImgList (row, column) {
      let url = (column.propsHttp || {}).home || ''
      let value = (column.props || {}).value || DIC_PROPS.value;
      if (this.validatenull(row[column.prop])) return []
      if (column.listType == 'picture-img') return [url + row[column.prop]]
      let list = this.corArray(this.deepClone(row[column.prop]), column.separator);
      list.forEach((ele, index) => {
        if (typeof ele === 'object') {
          list[index] = url + ele[value];
        } else {
          list[index] = url + ele;
        }
      })
      return list;
    },
    handleDetail (row, column) {
      let result = row[column.prop];
      let DIC = column.parentProp ? (this.crud.cascaderDIC[row.$index] || {})[column.prop] : this.crud.DIC[column.prop]
      result = detail(row, column, this.crud.tableOption, DIC);
      if (!this.validatenull(DIC)) {
        row["$" + column.prop] = result;
      }
      return result;
    },
    handleShowLabel (row, column, DIC) {
      let result = "";
      if (!this.validatenull(DIC)) {
        result = detail(row, column, this.crud.tableOption, DIC);
        row["$" + column.prop] = result;
      }
      return result;
    },
    columnChange ($index, row, column) {
      if (this.validatenull(count[$index])) count[$index] = {}
      if (column.cascader) this.handleChange(column, row)
      if (!count[$index][column.prop]) {
        if (typeof column.change === 'function' && column.cell === true) {
          column.change({ row, column, index: $index, value: row[column.prop] })
        }
        this.crud.$emit('column-change', { row, column, index: $index, value: row[column.prop] })
        count[$index][column.prop] = true
        this.$nextTick(() => count[$index][column.prop] = false)
      }
    },
    handleChange (column, row) {
      this.$nextTick(() => {
        const columnOption = [...this.crud.propOption];
        //本节点;
        const cascader = column.cascader;
        const str = cascader.join(",");
        const columnNextProp = cascader[0];
        const value = row[column.prop];
        const rowIndex = row.$index;
        // 下一个节点
        const columnNext = this.findObject(this.columnOption, columnNextProp)
        if (this.validatenull(columnNext)) return
        // 如果本节点没有字典则创建节点数组
        if (this.validatenull(this.crud.cascaderDIC[rowIndex])) {
          this.$set(this.crud.cascaderDIC, rowIndex, {});
        }
        if (this.crud.formIndexList.includes(rowIndex)) {
          //清空子类字典
          cascader.forEach(ele => {
            this.$set(this.crud.cascaderDIC[rowIndex], ele.prop, []);
            cascader.forEach(ele => (row[ele] = ""));
          });
        }
        //最后一级
        if (
          this.validatenull(cascader) ||
          this.validatenull(value) ||
          this.validatenull(columnNext)
        ) {
          return;
        }
        sendDic({
          column: columnNext,
          value: value,
          form: row
        }).then(
          res => {
            //首次加载的放入队列记录
            if (!this.crud.formIndexList.includes(rowIndex)) this.crud.formIndexList.push(rowIndex);
            const dic = Array.isArray(res) ? res : [];
            // 修改字典
            this.$set(this.crud.cascaderDIC[rowIndex], columnNextProp, dic);

            if (!this.validatenull(dic[columnNext.cascaderIndex]) && !this.validatenull(dic) && !this.validatenull(columnNext.cascaderIndex)) {
              row[columnNextProp] = dic[columnNext.cascaderIndex][(columnNext.props || {}).value || DIC_PROPS.value]
            }
          }
        );
      })

    },
    openImg (list, index) {
      list = list.map(ele => {
        return { thumbUrl: ele, url: ele }
      })
      this.$ImagePreview(list, index);
    },
    //表格筛选逻辑
    handleFiltersMethod (value, row, column) {
      const columnNew = this.columnOption.filter(
        ele => ele.prop === column.property
      )[0];
      if (typeof columnNew.filtersMethod === "function") {
        return columnNew.filtersMethod(value, row, columnNew);
      } else {
        return row[columnNew.prop] === value;
      }
    },
    //表格筛选字典
    handleFilters (column, flag) {
      if (flag !== true) return undefined;
      let DIC = this.crud.DIC[column.prop] || []
      let list = [];
      if (!this.validatenull(DIC)) {
        DIC.forEach(ele => {
          const props = column.props || this.crud.tableOption.props || {};
          list.push({
            text: ele[props.label || DIC_PROPS.label],
            value: ele[props.value || DIC_PROPS.value]
          });
        });
      } else {
        this.crud.cellForm.list.forEach(ele => {
          if (!list.map(item => item.text).includes(ele[column.prop])) {
            list.push({
              text: ele[column.prop],
              value: ele[column.prop]
            });
          }
        });
      }
      return list;
    }
  }
});
</script>

