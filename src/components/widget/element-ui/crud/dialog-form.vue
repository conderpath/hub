<template>
  <component :is="dialogType"
             lock-scroll
             :destroy-on-close="crud.tableOption.dialogDestroy"
             :class="['ac-dialog',b('dialog'),{'ac-dialog--fullscreen':fullscreen}]"
             :wrapperClosable="crud.tableOption.dialogClickModal"
             :direction="direction"
             v-dialogdrag="vaildData(crud.tableOption.dialogDrag,config.dialogDrag)"
             :custom-class="vaildData(crud.tableOption.customClass,config.customClass)"
             :fullscreen="fullscreen"
             :modal-append-to-body="vaildData(crud.tableOption.modalAppend,false)"
             append-to-body
             :top="setPx(dialogTop)"
             :title="dialogTitle"
             :close-on-press-escape="crud.tableOption.dialogEscape"
             :close-on-click-modal="vaildData(crud.tableOption.dialogClickModal,false)"
             :modal="crud.tableOption.dialogModal"
             :show-close="crud.tableOption.dialogCloseBtn"
             :visible.sync="boxVisible"
             :size="size?size:width"
             :width="setPx(width)"
             :before-close="hide">
    <div slot="title"
         :class="b('dialog__header')">
      <span class="el-dialog__title">{{dialogTitle}}</span>
      <div :class="b('dialog__menu')">
        <i @click="handleFullScreen"
           :class="fullscreen?'el-icon-news':'el-icon-full-screen'"
           class="el-dialog__close"></i>
      </div>
    </div>
    <el-scrollbar :style="styleName">
      <ac-form   v-model="crud.tableForm"
                 v-if="boxVisible"
                 ref="tableForm"
                 :status.sync="disabled"
                 @change="handleChange"
                 @submit="handleSubmit"
                 @reset-change="hide"
                 @tab-click="handleTabClick"
                 @error="handleError"
                 v-bind="$uploadFun({},crud)"
                 :option="formOption">
        <!-- 循环form表单卡槽 -->
        <template slot-scope="scope"
                  v-for="item in crud.formSlot"
                  :slot="item.prop">
          <slot :name="item.prop"
                v-bind="scope"></slot>
        </template>
        <!-- 循环form表单错误卡槽 -->
        <template slot-scope="scope"
                  v-for="item in crud.errorSlot"
                  :slot="crud.getSlotName(item,'E')">
          <slot :name="crud.getSlotName(item,'E')"
                v-bind="scope"></slot>
        </template>
        <!-- 循环form表单组件自定义卡槽 -->
        <template slot-scope="scope"
                  v-for="item in crud.typeSlot"
                  :slot="crud.getSlotName(item,'T')">
          <slot :name="crud.getSlotName(item,'T')"
                v-bind="scope"></slot>
        </template>
        <!-- 循环form表单标签卡槽 -->
        <template slot-scope="scope"
                  v-for="item in crud.labelSlot"
                  :slot="crud.getSlotName(item,'L')">
          <slot :name="crud.getSlotName(item,'L')"
                v-bind="scope"></slot>
        </template>
        <template slot="menuForm"
                  slot-scope="scope">
          <slot name="menuForm"
                v-bind="Object.assign(scope,{
                    type:boxType
                  }) "></slot>
        </template>
      </ac-form>
    </el-scrollbar>
    <span class="ac-dialog__footer"
          :class="'ac-dialog__footer--'+dialogMenuPosition">
        <el-button v-if="vaildData(formOption.submitBtn,true) && !isView"
                   @click="submit"
                   :disabled="disabled"
                   :size="crud.controlSize"
                   :icon="formOption.submitIcon"
                   type="primary">{{formOption.submitText}}</el-button>
        <el-button v-if="vaildData(formOption.emptyBtn,true) && !isView"
                   @click="reset"
                   :disabled="disabled"
                   :size="crud.controlSize"
                   :icon="formOption.emptyIcon">{{formOption.emptyText}}</el-button>

       <template v-if="vaildData(formOption.menuFormComponent)">
        <template v-for="(item,index) in vaildData(formOption.menuFormComponent.menus,[])">
          <component :is="formOption.menuFormComponent.getComponent(item.component)"
                     v-if="vaildData(item.show,true)"
                     v-bind="item"
                     v-on="item.event">
          </component>
        </template>
      </template>
        <slot name="menuForm"
              :disabled="disabled"
              :size="crud.controlSize"
              :type="boxType"></slot>
      </span>
  </component>
</template>

<script>
import { filterDefaultParams } from '../../core/utils/utils'
import create from "../../core/utils/create";
import locale from "../../core/mixins/locale";
import config from "./config";
export default create({
  name: "crud",
  mixins: [locale],
  inject: ["crud"],
  data () {
    return {
      config: config,
      boxType: "",
      fullscreen: false,
      size: null,
      boxVisible: false,
      boxHeight: 0,
      index: -1,
      disabled:false
    };
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    boxVisible (val) {
      if (val) {
        this.$nextTick(() => {
          this.initFun()
        })
      }
    }
  },
  computed: {
    styleName () {
      return {
        height: this.dialogHeight,
        overflow: 'hidden'
      }
    },
    isView () {
      return this.boxType === 'view'
    },
    isAdd () {
      return this.boxType === 'add'
    },
    isEdit () {
      return this.boxType === 'edit'
    },
    direction () {
      return this.crud.tableOption.dialogDirection
    },
    width () {
      return this.vaildData(this.crud.tableOption.dialogWidth + '', this.crud.isMobile ? '100%' : config.dialogWidth + '')
    },
    dialogType () {
      return this.isDrawer ? 'elDrawer' : 'elDialog'
    },
    dialogTop () {
      return this.crud.tableOption.dialogTop || config.dialogTop
    },
    isDrawer () {
      return this.crud.tableOption.dialogType === 'drawer';
    },
    dialogHeight () {
      if (this.isDrawer) {
        return 'calc(100% - 100px)';
      }
      if (this.crud.tableOption.dialogHeight === config.dialogHeight) {
        return this.setPx(config.clientHeight - 3 * this.dialogTop);
      }
      return this.setPx(this.crud.tableOption.dialogHeight);
    },
    formOption () {
      let option = this.deepClone(this.crud.tableOption);
      option.boxType = this.boxType;
      option.column = this.deepClone(this.crud.propOption);
      option.printBtn = false;
      option.mockBtn = false;
      option.menuBtn = false;
      if (this.isView) {
        option.menuBtn = false;
        option.detail = true;
      } else {
        option.menuPosition = option.dialogMenuPosition || 'right'
        if (this.isAdd) {
          option.submitBtn = option.saveBtn;
          option.submitText = this.crud.menuIcon('saveBtn');
          option.submitIcon = option.saveBtnIcon || config.saveBtnIcon
        } else if (this.isEdit) {
          option.submitBtn = option.updateBtn;
          option.submitText = this.crud.menuIcon('updateBtn');
          option.submitIcon = option.updateBtnIcon || config.updateBtnIcon
        }
        option.emptyBtn = option.cancelBtn;
        option.emptyIcon = option.cancelBtnIcon || config.cancelBtnIcon;
        option.emptyText = this.crud.menuIcon('cancelBtn')
        option.menuComponent =  option.menuFormComponent || []
      }
      //不分组的表单不加载字典
      if (!this.crud.isGroup) {
        option.dicFlag = false;
        option.dicData = this.crud.DIC;
      }
      if (!this.validatenull(option.dicFlag)) {
        option.column.forEach(ele => {
          ele.boxType = this.boxType;
          ele.dicFlag = ele.dicFlag || option.dicFlag
        })
      }

      return option;
    },
    dialogTitle () {
      const key = `${this.boxType}`;
      if (!this.validatenull(this.boxType)) {
        return this.crud.tableOption[key + 'Title'] || this.t(`crud.${key}Title`);
      }
    },
    dialogMenuPosition () {
      return this.crud.option.dialogMenuPosition || 'right'
    }
  },
  methods: {
    submit () {
      this.$refs.tableForm.submit()
    },
    reset () {
      this.$refs.tableForm.resetForm(false)
    },
    getSlotName (item) {
      return item.replace('Form', '')
    },
    handleChange () {
      this.crud.$emit('input', this.crud.tableForm)
      this.crud.$emit('change', this.crud.tableForm)
    },
    handleTabClick (tab, event) {
      this.crud.$emit('tab-click', tab, event)
    },
    handleFullScreen () {
      if (this.isDrawer) {
        if (this.validatenull(this.size)) {
          this.size = '100%'
        } else {
          this.size = ''
        }
      } else {
        if (this.fullscreen) {
          this.fullscreen = false;
        } else {
          this.fullscreen = true;
        }
      }

    },
    handleError (error) {
      this.crud.$emit('error', error)
    },
    handleSubmit (form, hide) {
      if (this.isAdd) {
        this.rowSave(hide);
      } else if (this.isEdit) {
        this.rowUpdate(hide);
      }
    },
    initFun () {
      ['clearValidate', 'validate', 'resetForm'].forEach(ele => {
        this.crud[ele] = this.$refs.tableForm[ele]
      })
    },
    // 保存
    rowSave (hide) {
      this.crud.$emit(
        "row-save",
        filterDefaultParams(this.crud.tableForm, this.crud.tableOption.translate),
        this.closeDialog,
        hide
      );
    },
    // 更新
    rowUpdate (hide) {
      const index = this.crud.tableIndex;
      this.crud.$emit(
        "row-update",
        filterDefaultParams(this.crud.tableForm, this.crud.tableOption.translate),
        this.index,
        this.closeDialog,
        hide
      );
    },
    closeDialog (row, index) {
      const callback = () => {
        if (this.isEdit) {
          let obj = this.findObject(this.crud.data, row[this.crud.rowKey], this.crud.rowKey);
          obj = Object.assign(obj || {}, row);
        } else if (this.isAdd) {
          const callback = (list = [], index) => {
            this.validatenull(index) ? list.push(row) : list.splice(index, 0, row);
          }
          if (this.crud.isTree) {
            let childrenKey = this.crud.treeProps['children'] || 'children'
            let hasChildrenKey = this.crud.treeProps['hasChildren'] || 'hasChildren'
            if (!row[childrenKey]) row[childrenKey] = []
            if (this.crud.vaildParent(row)) {
              callback(this.crud.data, index)
            } else {
              let parent = this.findObject(this.crud.data, row[this.crud.rowParentKey], this.crud.rowKey);
              if (parent === undefined) {
                return callback(this.crud.data, index)
              }
              if (!parent[childrenKey]) {
                parent[hasChildrenKey] = true
                parent[childrenKey] = []
              }
              callback(parent[childrenKey], index)
            }
          } else {
            callback(this.crud.data, index)
          }
        }
      }
      if (row) callback();
      this.hide();
    },
    // 隐藏表单
    hide (done) {
      const callback = () => {
        done && done();
        Object.keys(this.crud.tableForm).forEach(ele => {
          this.$delete(this.crud.tableForm, ele);
        })
        this.crud.tableIndex = -1;
        this.boxVisible = false;
      };
      if (typeof this.crud.beforeClose === "function") {
        this.crud.beforeClose(callback, this.boxType);
      } else {
        callback();
      }
    },
    // 显示表单
    show (type, index = -1,row) {
      this.index = index;
      this.boxType = type;
      const callback = () => {
        this.$nextTick(() => {
          this.fullscreen = this.crud.tableOption.dialogFullscreen
          this.boxVisible = true;
        });
      };
      if (typeof this.crud.beforeOpen === "function") {
        this.crud.beforeOpen(callback, this.boxType,row);
      } else {
        callback();
      }
    }
  }
});
</script>
