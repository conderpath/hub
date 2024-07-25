<template>
  <div
    :class="b()"
    class="ac-form-container"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="setPx(formOption.labelWidth,labelWidth)"
    >
      <el-row :span="24">
        <!--表单字段-->
        <template v-for=" column in formOption.column">
          <el-col
            v-if="validDisplay(column)"
            :key="column.prop"
            :span="getSpan(column)"
            :xl="column.xlSpan || formOption.xlSpan || 6"
            :sm="column.smSpan || formOption.smSpan || 12"
            :class="[{'ac--detail':validDetail(column)},column.className]"
          >
            <el-form-item
              :label="column.label"
              :prop="column.prop"
              :rules="column.rules"
              :label-width="getLabelWidth(column,formOption)"
            >
              <!--select选择组件-->
              <el-select
                v-if="typeCheck(column,['select'])&& !validData(column.typeslot,false)"
                v-model="form[column.prop]"
                :clearable="validData(column.clearable,true)"
                :disabled="getDisabled(column)"
                :multiple="column.multiple"
                @change="(val)=>handleChange(val,column)"
              >
                <template v-if="column.group">
                  <el-option-group
                    v-for="group in column.group"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :disabled="item[getKey(column,'disabled')]"
                      :label="item[getKey(column,'label')]"
                      :value="item[getKey(column,'value')]"
                    />
                  </el-option-group>
                </template>
                <template v-else>
                  <el-option
                    v-for="(item,index) in column.dicData"
                    :key="index"
                    :disabled="item[getKey(column,'disabled')]"
                    :label="item[getKey(column,'label')]"
                    :value="item[getKey(column,'value')]"
                  />
                </template>
              </el-select>
              <!--日期时间选择-->
              <el-date-picker
                v-if="typeCheck(column,['year','month','date','week', 'datetime','datetimerange','daterange'])&& !validData(column.typeslot,false)"
                v-model="form[column.prop]"
                :type="column.type"
                :size="column.size || controlSize"
                :editable="column.editable || true"
                :unlink-panels="column.unlinkPanels || false"
                :readonly="column.readonly || false"
                :default-value="column.defaultValue"
                :default-time="column.defaultTime"
                :range-separator="column.rangeSeparator"
                :start-placeholder="column.startPlaceholder || '开始日期'"
                :end-placeholder="column.endPlaceholder || '结束日期'"
                :format="column.format"
                :clearable="column.disabled?false:column.clearable"
                :picker-options="column.pickerOptions || {}"
                :value-format="column.valueFormat"
                :disabled="getDisabled(column)"
                v-on="handleEvent(column)"
              />

              <!--checkbox选择-->
              <el-checkbox-group
                v-if="typeCheck(column,['checkbox']) && !validData(column.typeslot,false)"
                v-model="form[column.prop]"
                :disabled="getDisabled(column)"
              >
                <el-checkbox
                  v-for="(item,index) in column.dicData"
                  :key="index"
                  :label="item[getKey(column,'value')]"
                  :disabled="item[getKey(column,'disabled')]"
                  :name="column.prop"
                >
                  {{ item[getKey(column,'label')] }}
                </el-checkbox>
              </el-checkbox-group>
              <!--富文本-->
              <acvu-ueditor
                v-if="typeCheck(column,['ueditor']) && !validDetail(column) && !validData(column.typeslot,false)"
                v-model="form[column.prop]"
                :disabled="getDisabled(column)"
                :options="column.option || {}"
              />
              <div
                v-if="typeCheck(column,['ueditor']) && validDetail(column) && !validData(column.typeslot,false)"
                class="ueditor"
                v-html="form[column.prop]"
              />
              <!--input-table组件-->
              <ac-input-table
                v-if="typeCheck(column,['inputTable']) && !validData(column.typeslot,false)"
                v-model="form[column.prop]"
                :value="form[column.prop]"
                v-bind="column"
              />

              <!--input输入组件-->
              <el-input
                v-if="typeCheck(column,['input','password', 'textarea','number'])&& !validData(column.typeslot,false)"
                v-model="form[column.prop]"
                :clearable="validData(column.clearable,true)"
                :type="column.type"
                :maxlength="column.maxlength"
                :disabled="getDisabled(column)"
                :rows="column.rows || 2"
                :show-password="validData(column.showPassword,true) && column.type==='password'"
              />
              <!--插槽-->
              <slot
                v-if="$scopedSlots[column.prop]"
                :value="form[column.prop]"
                :column="column"
                :clearable="validData(column.clearable,true)"
                :disabled="getDisabled(column)"
                :label="form['$'+column.prop]"
                :size="column.size || controlSize"
                :name="column.prop"
                :placeholder="''"
              />
            </el-form-item>
          </el-col>
        </template>
        <!--按钮-->
        <el-col
          :span="menuSpan"
          :class="menuClass"
        >
          <div :class="['ac-button-box',validData(formOption.menuPosition,'center') +'__button']">
            <el-button
              v-if="validData(formOption.submitBtn,true)"
              type="primary"
              :size="controlSize"
              :icon="formOption.submitIcon || 'el-icon-check'"
              :loading="allDisabled"
              @click="submit"
            >
              {{ validData(formOption.submitText,$t("form.submit")) }}
            </el-button>
            <el-button
              v-if="validData(formOption.emptyBtn,true)"
              :icon="formOption.emptyIcon || 'el-icon-delete'"
              :size="controlSize"
              :loading="allDisabled"
              @click="resetForm"
            >
              {{ validData(formOption.emptyText,$t("form.empty")) }}
            </el-button>
            <slot
              name="menuForm"
              :disabled="allDisabled"
              :size="controlSize"
            />
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import {validData, validatenull, deepClone} from '../../core/utils/utils'
import create from '../../core/utils/create'
import common from "../../core/mixins/common";
/*import acvuUeditor from './ac-ueditor/ueditor'*/
import {clearVal,setAsVal} from '../../core/utils/utils'

export default create({
  name: "form",
  components:{
    /* acvuUeditor*/
  },
  props:{
    option:{
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    value:{
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  mixins:[common],
  data() {
    return {
      labelWidth:90,
      form:{},
      formOption:{},
      allDisabled:false,
      formCreate:false,
      itemSpanDefault:8,
      bindList: {},
      formVal:{}
    }
  },
  computed:{
    controlSize () {
      return this.formOption.size || 'small';
    },
    menuSpan () {
      return this.formOption.menuSpan || 24;
    },
    menuClass() {
      let menuClass = this.formOption.menuClass
      if (Array.isArray(menuClass)){
        return menuClass
      }else if (typeof menuClass == 'string'){
        return  [menuClass]
      }else {
        return  []
      }
    }

  },
  watch: {
    option: {
      handler () {
        this.formOption = this.option
      },
      deep: true
    },
    form: {
      handler () {
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
    }
  },
  created () {
    this.init()
  },
  methods: {
    handleChange(val,column){
      if (column.change){
        column.change(val)
      }
    },
    //对部分表单字段进行校验的方法
    validateField (val) {
      return this.$refs.form.validateField(val);
    },
    //初始化表单
    dataFormat () {
      const formDefault = this.formInitVal(this.formOption.column);
      let value = deepClone(formDefault.tableForm);
      this.setForm(deepClone(Object.assign(value, this.formVal)))
    },
    //表单赋值
    setForm (value) {
      Object.keys(value).forEach(ele => {
        let result = value[ele];
        let column = this.formOption.column.find(column => column.prop == ele)
        this.$set(this.form, ele, result);
        if (!column) return
        let prop = column.prop
        let bind = column.bind
        if (bind && !this.bindList[prop]) {
          this.$watch('form.' + prop, (n, o) => {
            if (n != o) setAsVal(this.form, bind, n);
          })
          this.$watch('form.' + bind, (n, o) => {
            if (n != o) this.$set(this.form, prop, n);
          })
          this.$set(this.form, prop, eval('value.' + bind));
          this.bindList[prop] = true;
        }
      });
    },
    validData,
    getDisabled (column) {
      return this.validDetail(column) || this.validDisabled(column) || this.allDisabled
    },
    setPx (val, defval = '') {
      if (validatenull(val)) val = defval;
      if (validatenull(val)) return '';
      val = val + '';
      if (val.indexOf('%') === -1) {
        val = val + 'px';
      }
      return val;
    },
    getLabelWidth (column, item) {
      let result;
      if (!this.validatenull(column.labelWidth)) {
        result = column.labelWidth
      } else if (!this.validatenull(item.labelWidth)) {
        result = item.labelWidth
      } else {
        result = this.formOption.labelWidth;
      }
      return this.setPx(result, this.labelWidth);
    },
    typeCheck (column, typeList) {
      return  typeList.includes((column.type || 'input'))
    },
    init () {
      this.formOption = this.option
      this.$nextTick(() => {
        this.dataFormat();
        this.setVal();
        this.$nextTick(() => this.clearValidate())
        this.formCreate = true;
      })
    },
    submit() {
      this.$refs.form.validate((valid, msg) => {
        if (valid) {
          this.show()
          this.$emit("submit", this.form, this.hide);
        } else {
          this.$emit("error", msg);
        }
      })
    },
    show () {
      this.allDisabled = true;
    },
    hide () {
      this.allDisabled = false;
    },
    clearValidate (list) {
      this.$refs.form.clearValidate(list);
    },
    resetForm () {
      this.clearVal()
      this.clearValidate()
      this.$emit("reset-change");
    },
    clearVal () {
      this.form = clearVal(this.form, (this.formOption.clearExclude || []).concat(['id']))
      this.setVal()
    },
    setVal () {
      this.$emit("input", this.form);
      this.$emit("change", this.form);
    },
    getSpan (column) {
      return column.span || this.formOption.span || this.itemSpanDefault
    },
    handleEvent (column) {
      return column.event || {}
    },
    // 验证表单是否显隐
    validDisplay (column) {
      if (!this.validatenull(column.display)) {
        return this.vaildData(column.display, true);
      } else {
        return true;
      }
    },
    // 验证表单是否禁止
    validDisabled (column) {
      if (this.formOption.disabled) return true;
      if (!this.validatenull(column.disabled)) {
        return this.vaildData(column.disabled, false);
      }  else {
        return false;
      }
    },
    getKey(column,key){
      return  column.props ? column.props[key] ? column.props[key]:key:key
    },
    validDetail (column) {
      if (this.formOption.detail) return true;
      if (!this.validatenull(column.detail)) {
        return this.validData(column.detail, false);
      }  else {
        return false;
      }
    },
  }

})
</script>

<style scoped lang="less">




.ac-form-container {
  .el-select,.el-date-editor{
    width: 100%;
  }


  .ac-button-box{
    &.center__button{
      text-align: center;
    }
    &.right__button{
      text-align: right;
    }
  }

}
</style>
