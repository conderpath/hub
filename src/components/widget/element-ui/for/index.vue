<template>
  <div :class="[b(),{'ac--view':isView,'ac--detail':isDetail}]"
       :style="{width:setPx(parentOption.formWidth,'100%')}">
    <form-header v-if="vaildData(parentOption.formHeader ,false)">
      <template slot="headerLeft"
                slot-scope="scope">
        <slot name="headerLeft"
              v-bind="scope"></slot>
      </template>
      <template slot="headerRight"
                slot-scope="scope">
        <slot name="headerRight"
              v-bind="scope"></slot>
      </template>
    </form-header>
    <el-form ref="form"
             :status-icon="parentOption.statusIcon"
             @submit.native.prevent
             :model="form"
             :label-suffix="labelSuffix"
             :size=" controlSize"
             :label-position="parentOption.labelPosition"
             :label-width="setPx(parentOption.labelWidth,labelWidth)">
      <el-row :span="24"
              :class="{'ac-form__tabs':isTabs}">
        <ac-group v-for="(item,index) in columnOption"
                    @change="handleGroupClick"
                    :key="item.prop"
                    :tabs="isTabs"
                    :arrow="item.arrow"
                    :collapse="item.collapse"
                    :display="vaildDisplay(item)"
                    :icon="item.icon"
                    :index="index"
                    :header="!isTabs"
                    :active="activeName"
                    :label="item.label">
          <el-tabs slot="tabs"
                   v-model="activeName"
                   @tab-click="handleTabClick"
                   :class="b('tabs')"
                   :type="tabsType"
                   v-if="isTabs&&index == 1">
            <template v-for="(tabs,index) in columnOption">
              <el-tab-pane v-if="vaildDisplay(tabs) && index!=0"
                           :key="index"
                           :name="index+''">
                <span slot="label">
                  <slot :name="getSlotName(tabs,'H')"
                        v-if="$slots[getSlotName(tabs,'H')]"></slot>
                  <template v-else>
                    <i :class="tabs.icon">&nbsp;</i>
                    {{tabs.label}}
                  </template>
                </span>
              </el-tab-pane>
            </template>
          </el-tabs>
          <template slot="header"
                    v-if="$slots[getSlotName(item,'H')]">
            <slot :name="getSlotName(item,'H')"></slot>
          </template>

          <component  :is="item.getComponent(item.componentName)"
                      v-if="vaildData(item.componentName,'')"
                      v-bind="Object.assign(item)">
          </component>

          <div v-else :class="b('group',{'flex':vaildData(item.flex,true)})"
               v-show="isGroupShow(item,index)">
            <template v-for="(column,cindex) in item.column">
              <el-col v-if="vaildDisplay(column)"
                      :key="cindex"
                      :style="{paddingLeft:setPx((parentOption.gutter || 20)/2),paddingRight:setPx((parentOption.gutter ||20)/2)}"
                      :span="getSpan(column)"
                      :md="getSpan(column)"
                      :sm="column.smSpan || item.smSpan || 12"
                      :xs="column.xsSpan || item.xmSpan ||  24"
                      :offset="column.offset || item.offset ||  0"
                      :class="[b('row'),{'ac--detail':vaildDetail(column)},column.className]">
                <el-form-item :prop="column.prop"
                              :label="column.label"
                              :rules="column.rules"
                              :class="b('item--'+(column.labelPosition || item.labelPosition || ''))"
                              :label-position="column.labelPosition || item.labelPosition || parentOption.labelPosition"
                              :label-width="getLabelWidth(column,item)">
                  <template slot="label"
                            v-if="$scopedSlots[getSlotName(column,'L')]">
                    <slot :name="getSlotName(column,'L')"
                          :column="column"
                          :value="form[column.prop]"
                          :readonly="readonly || column.readonly"
                          :disabled="getDisabled(column)"
                          :size="column.size || controlSize"
                          :dic="DIC[column.prop]"></slot>
                  </template>
                  <template slot="label"
                            v-else-if="column.labelTip">
                    <el-tooltip class="item"
                                effect="dark"
                                :placement="column.labelTipPlacement || 'top-start'">
                      <div slot="content"
                           v-html="column.labelTip"></div>
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                    <span> {{column.label}}{{labelSuffix}}</span>
                  </template>
                  <template slot="error"
                            slot-scope="scope"
                            v-if="$scopedSlots[`${column.prop}Error`]">
                    <slot :name="column.prop+'Error'"
                          v-bind="Object.assign(scope,{
                            column,
                            value:form[column.prop],
                            readonly:column.readonly || readonly,
                            disabled:getDisabled(column),
                            size:column.size || controlSize,
                            dic:DIC[column.prop]
                          })"></slot>
                  </template>
                  <component :is="validTip(column)?'div':'elTooltip'"
                             :disabled="validTip(column)"
                             :content="vaildData(column.tip,getPlaceholder(column))"
                             :placement="column.tipPlacement">
                    <slot :value="form[column.prop]"
                          :column="column"
                          :label="form['$'+column.prop]"
                          :size="column.size || controlSize"
                          :readonly="readonly || column.readonly"
                          :disabled="getDisabled(column)"
                          :dic="DIC[column.prop]"
                          :name="column.prop"
                          v-if="$scopedSlots[column.prop]"></slot>
                    <form-temp :column="column"
                               v-else
                               :ref="column.prop"
                               :dic="DIC[column.prop]"
                               :props="parentOption.props"
                               :propsHttp="parentOption.propsHttp"
                               v-bind="$uploadFun(column)"
                               :disabled="getDisabled(column)"
                               :enter="parentOption.enter"
                               :size="parentOption.size"
                               :showPlaceholder="parentOption.showPlaceholder"
                               v-model="form[column.prop]"
                               :row=" column.type && column.type.startsWith('vm-') ? form:null"
                               @enter="submit"
                               :column-slot="getChildrenColumn(column)"
                               :column-header-slot="dynamicHeaderSlot(column)"
                               :detail="isDetail"
                               @change="propChange(item.column,column)">
                      <template :slot="citem.prop"
                                slot-scope="scope"
                                v-for="citem in getChildrenColumn(column)">
                        <slot v-bind="scope"
                              :name="citem.prop"></slot>
                      </template>
                      <template :slot="getSlotName(item,'N')"
                                slot-scope="scope"
                                v-for="item in dynamicHeaderSlot(column)">
                        <slot :name="getSlotName(item,'N')"
                              v-bind="scope"></slot>
                      </template>
                      <template :slot="getSlotName(column,'T')"
                                slot-scope="scope"
                                v-for="item in $scopedSlots[getSlotName(column,'T')]?[column]:[]">
                        <slot :name="getSlotName(item,'T')"
                              v-bind="scope"></slot>
                      </template>
                    </form-temp>
                  </component>
                </el-form-item>
              </el-col>
              <div :class="b('line')"
                   v-if="vaildDisplay(column)&&column.row && column.span!==24 && column.count"
                   :key="`line${cindex}`"
                   :style="{width:(column.count/24*100)+'%'}"></div>
            </template>
            <slot name="search"></slot>
            <form-menu v-if="!isDetail && !isMenu">
              <template slot-scope="scope"
                        slot="menuForm">
                <slot name="menuForm"
                      v-bind="scope"></slot>
              </template>
            </form-menu>
          </div>
        </ac-group>
        <form-menu v-if="!isDetail && isMenu">
          <template slot-scope="scope"
                    slot="menuForm">
            <slot name="menuForm"
                  v-bind="scope"></slot>
          </template>
        </form-menu>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { detail } from "../../core/utils/detail";
import create from "../../core/utils/create";
import init from "../../core/mixins/init";
import formTemp from '../components/form/index'
import { DIC_PROPS } from '../../core/utils/variable';
import { getComponent, getPlaceholder, formInitVal, calcCount, calcCascader } from "../../core/utils/dataformat";
import { sendDic } from "../../core/utils/dic";
import { filterDefaultParams,filterParams, clearVal, getAsVal, setAsVal, arraySort } from '../../core/utils/utils'
import mock from "../../core/utils/mock";
import formMenu from './menu'
import formHeader from './form-header'
export default create({
  name: "form",
  mixins: [init()],
  components: {
    formTemp,
    formMenu,
    formHeader,
  },
  data () {
    return {
      activeName: '',
      labelWidth: 90,
      allDisabled: false,
      optionIndex: [],
      optionBox: false,
      tableOption: {},
      itemSpanDefault: 12,
      bindList: {},
      form: {},
      formList: [],
      formCreate: false,
      formDefault: {},
      formVal: {},
      formBind: {},
    };
  },
  provide () {
    return {
      formSafe: this
    };
  },
  watch: {
    tabsActive: {
      handler (val) {
        this.activeName = this.tabsActive
      },
      immediate: true
    },
    form: {
      handler (val) {
        if (this.formCreate) this.setVal();
      },
      deep: true
    },
    value: {
      handler (val) {
        if (this.formCreate) {
          this.setForm(val);
        } else {
          this.formVal = Object.assign(this.formVal, val || {});
        }
      },
      deep: true,
      immediate: true
    },
    allDisabled: {
      handler (val) {
        this.$emit('update:status', val)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {

    labelSuffix () {
      return this.parentOption.labelSuffix || ':'
    },
    isMenu () {
      return this.columnOption.length != 1
    },
    isDetail () {
      return this.option.detail
    },
    isAdd () {
      return this.boxType === "add"
    },
    isTabs () {
      return this.parentOption.tabs;
    },
    isEdit () {
      return this.boxType === "edit"
    },
    isView () {
      return this.boxType === "view"
    },
    disabled () {
      return this.parentOption.disabled
    },
    readonly () {
      return this.parentOption.readonly
    },
    tabsType () {
      return this.parentOption.tabsType;
    },
    columnLen () {
      return this.columnOption.length
    },
    dynamicOption () {
      let list = []
      this.propOption.forEach(ele => {
        if (ele.type == 'dynamic' && this.vaildDisplay(ele)) {
          list.push(ele)
        }
      })
      return list
    },
    controlOption () {
      let list = [];
      this.propOption.forEach(ele => {
        if (ele.control) list.push(ele);
      });
      return list;
    },
    propOption () {
      let list = [];
      this.columnOption.forEach(option => {
        option.column.forEach(column => list.push(column));
      });
      return list;
    },
    parentOption () {
      let option = this.deepClone(this.tableOption);
      let group = option.group;
      if (!group) {
        option = Object.assign(option, {
          group: [this.deepClone(option)]
        });
      }
      if (group) {
        //处理分组以外的部分
        group.unshift({
          arrow: false,
          column: option.column
        })
      }
      return option;
    },
    columnOption () {
      let list = [...this.parentOption.group] || [];
      list.forEach((ele, index) => {
        ele.column = ele.column || [];
        // 循环列的全部属性
        ele.column.forEach((column, cindex) => {
          //动态计算列的位置，如果为隐藏状态则或则手机状态不计算
          if (column.display !== false && !this.isMobile) {
            column = calcCount(column, this.itemSpanDefault, cindex === 0);
          }
        });
        //处理级联属性
        ele.column = calcCascader(ele.column);
        //根据order排序
        ele.column = arraySort(ele.column, 'order', (a, b) => a.order - b.order)
      });
      return list;
    },
/*
    columnOption () {
      let column = this.tableOption.column || []
      let group = this.tableOption.group || [];
      let footer = this.tableOption.footer || [];
      if (column.length !== 0) {
        group.unshift({
          header: false,
          column: column
        })
      }
      if (footer.length !== 0) {
        group.push({
          header: false,
          column: footer
        })
      }
      group.forEach((ele, index) => {
        ele.column = ele.column || [];
        // 循环列的全部属性
        ele.column.forEach((column, cindex) => {
          //动态计算列的位置，如果为隐藏状态则或则手机状态不计算
          if (column.display !== false && !this.isMobile) {
            column = calcCount(column, this.itemSpanDefault, cindex === 0);
          }
        });
        //处理级联属性
        ele.column = calcCascader(ele.column);
        //根据order排序
        ele.column = ele.column.sort((a, b) => b.order || 0 - a.order || 0)
      });
      return group;
    },*/



    menuPosition: function () {
      if (this.parentOption.menuPosition) {
        return this.parentOption.menuPosition;
      } else {
        return "center";
      }
    },
    boxType: function () {
      return this.parentOption.boxType;
    },
    isPrint () {
      return this.vaildData(this.parentOption.printBtn, false)
    },
    tabsActive () {
      return this.vaildData(this.tableOption.tabsActive + '', '1')
    },
    isMock () {
      return this.vaildData(this.parentOption.mockBtn, false);
    }
  },
  props: {
    uploadBefore: Function,
    uploadAfter: Function,
    uploadDelete: Function,
    uploadPreview: Function,
    uploadError: Function,
    uploadExceed: Function,
    isCrud: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
/*  created () {
    this.$nextTick(() => {
      this.dataFormat();
      this.setVal();
      this.$nextTick(() => this.clearValidate())
      //this.formCreate = true;
    })
  },*/
  mounted () {
    setTimeout(() => {
      this.dataFormat()
    })
  },
  methods: {
    getComponent,
    getPlaceholder,
    dynamicHeaderSlot (column){
      let columnList = []
      let self = this
      function dealScopedSlots(list){
        if (!Array.isArray(list)) return
        list.forEach((item,index)=>{
          let $scopedSlots = self.$scopedSlots[`${item.prop}DynamicHeader`]
          if ($scopedSlots){
            columnList.push(item)
          }
          if (item.children){
            dealScopedSlots(item.children)
          }
        })
      }
      dealScopedSlots((column.children || {}).column || [])
      return  columnList
      /*   console.log('((column.children || {}).column || []).filter(ele => this.$scopedSlots[`${ele.prop}DynamicHeader`])',((column.children || {}).column || []).filter(ele => this.$scopedSlots[`${ele.prop}DynamicHeader`]))
         return ((column.children || {}).column || []).filter(ele => this.$scopedSlots[`${ele.prop}DynamicHeader`])*/
    },
    getChildrenColumn (column) {
      let columnList = []
      let self = this
      function dealScopedSlots(list){
        if (!Array.isArray(list)) return
        list.forEach((item,index)=>{
          let $scopedSlots =  self.$scopedSlots[item.prop]
          if ($scopedSlots){
            columnList.push(item)
          }
          if (item.children){
            dealScopedSlots(item.children)
          }
        })
      }
      dealScopedSlots((column.children || {}).column || [])
      return columnList
      /* return ((column.children || {}).column || []).filter(ele => this.$scopedSlots[ele.prop])*/
    },
/*    getChildrenColumn (column) {
      return ((column.children || {}).column || []).filter(ele => this.$scopedSlots[ele.prop])
    },*/
    getDisabled (column) {
      return this.vaildDetail(column) || this.isDetail || this.vaildDisabled(column) || this.allDisabled
    },
    getSpan (column) {
      return column.span || this.parentOption.span || this.itemSpanDefault
    },
    isGroupShow (item, index) {
      if (this.isTabs) {
        return index == this.activeName || index == 0
      } else {
        return true;
      }
    },
    forEachLabel () {
      this.propOption.forEach(column => {
        this.handleShowLabel(column, this.DIC[column.prop]);
      });
    },
    handleGroupClick (activeNames) {
      this.$emit('tab-click', activeNames)
    },
    handleTabClick (tab, event) {
      this.$emit('tab-click', tab, event)
    },
    getLabelWidth (column, item) {
      let result;
      if (!this.validatenull(column.labelWidth)) {
        result = column.labelWidth
      } else if (!this.validatenull(item.labelWidth)) {
        result = item.labelWidth
      } else {
        result = this.parentOption.labelWidth;
      }
      return this.setPx(result, this.labelWidth);
    },
    //获取全部字段字典的label
    handleShowLabel (column, DIC) {
      let result;
      if (!this.validatenull(DIC)) {
        result = detail(this.form, column, this.tableOption, DIC);
        this.$set(this.form, ["$" + column.prop], result);
      }
      return result;
    },
    //对部分表单字段进行校验的方法
    validateField (val) {
      return this.$refs.form.validateField(val);
    },
    validTip (column) {
      return !column.tip || column.type === 'upload'
    },
    getPropRef (prop) {
      return this.$refs[prop][0];
    },
    //初始化表单
    dataFormat () {
      let formDefault = formInitVal(this.propOption).tableForm;
      let formValue = this.value
      let form = {}

      Object.entries(Object.assign(formDefault, formValue)).forEach(ele => {
        let key = ele[0], value = ele[1]
        if (this.validatenull(formValue[key])) {
          form[key] = value
        } else {
          form[key] = formValue[key]
        }
      })
      this.$set(this, 'form', form)
      this.setLabel()
      this.setControl()
      this.setVal()
      setTimeout(() => {
        this.formCreate = true
        this.clearValidate()
      })
    },
    setControl () {
      this.propOption.forEach(column => {
        let prop = column.prop
        let bind = column.bind
        let control = column.control
        let value = this.form
        if (!this.formBind[prop]) {
          let bindList = [];
          if (bind) {
            let formProp = this.$watch('form.' + prop, (n, o) => {
              if (n != o) setAsVal(this.form, bind, n);
            })
            let formDeep = this.$watch('form.' + bind, (n, o) => {
              if (n != o) this.$set(this.form, prop, n);
            })
            bindList.push(formProp)
            bindList.push(formDeep)
            this.$set(this.form, prop, eval('value.' + bind));
          }
          if (control) {
            const callback = () => {
              let controlList = control(this.form[column.prop], this.form) || {};
              Object.keys(controlList).forEach(item => {
                let ele = Object.assign(this.objectOption[item] || {}, controlList[item])
                this.$set(this.objectOption, item, ele)
                if (controlList[item].dicData) this.DIC[item] = controlList[item].dicData
              })
            }
            let formControl = this.$watch('form.' + prop, (n, o) => {
              callback()
            })
            bindList.push(formControl)
            callback()
          }
          this.formBind[prop] = bindList;
        }
      })
    },
    setForm () {
      Object.keys(this.value).forEach(ele => {
        this.$set(this.form, ele, this.value[ele]);
      });
     /* this.forEachLabel();*/
    },
    setVal () {
      this.$emit('input', this.form)
      this.$emit('change', this.form)
    },
    setLabel () {
      if (this.tableOption.filterNull === true) {
        this.form = filterParams(this.form, [''], false)
      }
      if (this.tableOption.filterDic == true) {
        this.form = filterParams(this.form, ['$'], false)
      } else {
        this.propOption.forEach(column => {
          let result;
          let DIC = this.DIC[column.prop]
          if (this.validatenull(DIC)) return
          result = detail(this.form, column, this.tableOption, DIC);
          if (result) {
            this.$set(this.form, `$${column.prop}`, result);
          } else {
            this.$delete(this.form, `$${column.prop}`)
          }
        });
      }
    },
/*    dataFormat () {
      this.formDefault = formInitVal(this.propOption);
      let value = this.deepClone(this.formDefault.tableForm);
      this.setForm(this.deepClone(Object.assign(value, this.formVal)))
    },
    setVal () {
      this.setControl();
      this.$emit("input", this.form);
      this.$emit("change", this.form);
    },
    setControl () {
      this.controlOption.forEach(ele => {
        let control = ele.control(this.form[ele.prop], this.form);
        Object.keys(control).forEach(item => {
          this.objectOption[item] = Object.assign(this.objectOption[item], control[item])
        })
      })
    },
    //表单赋值
    setForm (value) {
      Object.keys(value).forEach(ele => {
        let result = value[ele];
        let column = this.propOption.find(column => column.prop == ele)
        this.$set(this.form, ele, result);
        if (!column) return
        let prop = column.prop
        let bind = column.bind
        if (bind && !this.bindList[prop]) {
          this.$watch('form.' + prop, (n, o) => {
            console.log(prop,n != o,n,o)
            if (n != o) setAsVal(this.form, bind, n);
          })
          this.$watch('form.' + bind, (n, o) => {
            if (n != o) this.$set(this.form, prop, n);
          })
          this.$set(this.form, prop, eval('value.' + bind));
          this.bindList[prop] = true;
        }
      });
      this.forEachLabel();
    },*/
    handleChange (list, column) {
      this.$nextTick(() => {
        const cascader = column.cascader;
        const str = cascader.join(",");
        const columnNextProp = cascader[0];
        const value = this.form[column.prop];
        // 下一个节点
        const columnNext = this.findObject(list, columnNextProp)
        if (this.validatenull(columnNext)) return
        // 如果不是首次加载则清空全部关联节点的属性值和字典值
        if (this.formList.includes(str)) {
          //清空子类字典列表和值
          cascader.forEach(ele => {
            this.form[ele] = "";
            this.$set(this.DIC, ele, []);
          });
        }
        /**
         * 1.判断当前节点是否有下级节点
         * 2.判断当前节点是否有值
         */
        if (
          this.validatenull(cascader) ||
          this.validatenull(value) ||
          this.validatenull(columnNext)
        ) {return;}
        if (columnNext.dicUrl){
          // 根据当前节点值获取下一个节点的字典
          sendDic({
            column: columnNext,
            value: value,
            form: this.form
          }).then(res => {
            //首次加载的放入队列记录
            if (!this.formList.includes(str)) this.formList.push(str);
            // 修改字典
            const dic = Array.isArray(res) ? res : [];
            this.$set(this.DIC, columnNextProp, dic);
            if (!this.validatenull(dic) && !this.validatenull(dic) && !this.validatenull(columnNext.cascaderIndex) && this.validatenull(this.form[columnNextProp])) {
              this.form[columnNextProp] = dic[columnNext.cascaderIndex][(columnNext.props || {}).value || DIC_PROPS.value]
            }
          });
        }else {

        }
      })
    },
    handlePrint () {
      this.$Print(this.$el);
    },
    propChange (option, column) {
      if (this.$refs.form) this.$refs.form.validateField(column.prop)
      if (column.cascader) this.handleChange(option, column)
    },
    handleMock () {
      if (!this.isMock) return
      this.columnOption.forEach(column => {
        const form = mock(column.column, this.DIC, this.form, this.isMock);
        if (!this.validatenull(form)) {
          Object.keys(form).forEach(ele => {
            this.form[ele] = form[ele];
          });

        }
      });
      this.clearValidate();
      this.$emit('mock-change', this.form);
    },
    vaildDetail (column) {
      if (this.detail) return true;
      if (!this.validatenull(column.detail)) {
        return this.vaildData(column.detail, false);
      } else if (this.isAdd) {
        return this.vaildData(column.addDetail, false);
      } else if (this.isEdit) {
        return this.vaildData(column.editDetail, false);
      } else if (this.isView) {
        return true;
      } else {
        return false;
      }
    },
    // 验证表单是否禁止
    vaildDisabled (column) {
      if (this.disabled) return true;
      if (!this.validatenull(column.disabled)) {
        return this.vaildData(column.disabled, false);
      } else if (this.isAdd) {
        return this.vaildData(column.addDisabled, false);
      } else if (this.isEdit) {
        return this.vaildData(column.editDisabled, false);
      } else if (this.isView) {
        return true;
      } else {
        return false;
      }
    },
    // 验证表单是否显隐
    vaildDisplay (column) {
      if (!this.validatenull(column.display)) {
        return this.vaildData(column.display, true);
      } else if (this.isAdd) {
        return this.vaildData(column.addDisplay, true);
      } else if (this.isEdit) {
        return this.vaildData(column.editDisplay, true);
      } else if (this.isView) {
        return this.vaildData(column.viewDisplay, true);
      } else {
        return true;
      }
    },
    clearValidate (list) {
      this.$refs.form.clearValidate(list);
    },
    validateCellForm () {
      return new Promise(resolve => {
        this.$refs.form.validate((valid, msg) => {
          resolve(msg)
        });
      })
    },
    validate (callback) {
      this.$refs.form.validate((valid, msg) => {
        let dynamicList = [];
        let dynamicName = [];
        let dynamicError = {};
        this.dynamicOption.forEach(ele => {
          let isForm = ele.children.type === 'form'
          dynamicName.push(ele.prop);
          if (isForm) {
            if (!this.validatenull(this.$refs[ele.prop][0].$refs.temp.$refs.main)) {
              this.$refs[ele.prop][0].$refs.temp.$refs.main.forEach(ele => {
                dynamicList.push(ele.validateCellForm());
              })
            }
          } else {
            dynamicList.push(this.$refs[ele.prop][0].$refs.temp.$refs.main.validateCellForm());
          }
        })
        Promise.all(dynamicList).then(res => {
          let count = 0;
          res.forEach((error, index) => {
            if (!this.validatenull(error)) {
              dynamicError[dynamicName[index]] = error;
            }
          })
          let result = Object.assign(dynamicError, msg);
          if (this.validatenull(result)) {
            this.show();
            callback(true, this.hide)
          } else {
            callback(false, this.hide, result)
          }

        })
      });
    },
    resetForm () {
      this.clearVal();
      this.clearValidate();
      this.$emit("reset-change");
    },
    clearVal () {
      // 如果是查询页面时，主键也需要进行清空
      this.form = clearVal(this.form, (this.tableOption.clearExclude || []).concat(this.tableOption.isSearch ? []: [this.rowKey]))
      this.$emit("input", this.form);
      this.$emit("change", this.form);
    },
    resetFields () {
      this.$refs.form.resetFields();
    },
    show () {
      this.allDisabled = true;
    },
    hide () {
      this.allDisabled = false;
    },
    submit () {
      this.validate((valid, msg) => {
        if (valid) {
          this.$emit("submit", filterDefaultParams(this.form, this.parentOption.translate), this.hide);
        } else {
          this.$emit("error", msg);
        }
      });
    }
  },
  beforeDestroy () {
    Object.keys(this.formBind).forEach(ele => {
      this.formBind[ele].forEach(unWatch => {
        unWatch()
      })
    })
  }
});
</script>

<style scoped lang="less">
.ac-form__group--flex{
  padding-top: 10px;
}
</style>

