<template>
  <el-col :span="menuSpan"
          :md="menuSpan"
          :sm="12"
          :xs="24"
          :style="styleName"
          :class="[formSafe.b('menu',[formSafe.menuPosition]),'no-print',...menuClass]"
          v-if="vaildData(formSafe.parentOption.menuBtn,true)">
    <el-form-item label-width="0px">
      <el-button type="primary"
                 @click="formSafe.handleMock"
                 :size="formSafe.controlSize"
                 icon="el-icon-edit-outline"
                 :loading="formSafe.allDisabled"
                 v-if="formSafe.isMock">{{t("form.mockBtn")}}</el-button>
      <el-button type="primary"
                 @click="formSafe.handlePrint"
                 :size="formSafe.controlSize"
                 icon="el-icon-printer"
                 :loading="formSafe.allDisabled"
                 v-if="formSafe.isPrint">{{t("form.printBtn")}}</el-button>
      <el-button type="primary"
                 @click="formSafe.submit"
                 :size="formSafe.controlSize"
                 :icon="formSafe.parentOption.submitIcon || 'el-icon-check'"
                 :loading="formSafe.allDisabled"
                 :disabled="vaildData(formSafe.parentOption.submitBtnDisabled,false)"
                 v-if="vaildData(formSafe.parentOption.submitBtn,true)">{{vaildData(formSafe.parentOption.submitText,t("form.submit"))}}</el-button>
      <el-button :icon="formSafe.parentOption.emptyIcon || 'el-icon-delete'"
                 :size="formSafe.controlSize"
                 :loading="formSafe.allDisabled"
                 v-if="vaildData(formSafe.parentOption.emptyBtn,true)"
                 @click="formSafe.resetForm">{{vaildData(formSafe.parentOption.emptyText,t("form.empty"))}}</el-button>

      <template v-for="(menu,index) in vaildData(formSafe.parentOption.menuForm,[])">
        <el-button
            :key="index"
            v-if="vaildData(menu.show,true)"
            :type="vaildData(menu.type,'primary')"
            :icon="menu.icon"
            :disabled="vaildData(menu.disabled,false)"
            :size="formSafe.controlSize"
            :plain="vaildData(menu.plain,false)"
            :round="vaildData(menu.round,false)"
            @click.stop="()=>{menu.click && menu.click()}">
          {{ vaildData(menu.btnText,'')}}
        </el-button>
      </template>
      <template v-if="vaildData(formSafe.parentOption.menuComponent)">
        <template v-for="(item,index) in vaildData(formSafe.parentOption.menuComponent.menus,[])">
          <component  :is="formSafe.parentOption.menuComponent.getComponent(item.component)"
                      v-if="vaildData(item.show,true)"
                      v-bind="item"
                      v-on="item.event">
            {{item.text}}
          </component>
        </template>
      </template>
      <slot name="menuForm"
            :disabled="formSafe.allDisabled"
            :size="formSafe.controlSize"></slot>
    </el-form-item>
  </el-col>
</template>
<script>
import locale from "../../core/mixins/locale";
export default {
  inject: ["formSafe"],
  mixins: [locale],
  computed: {
    menuClass() {
      let menuClass = this.formSafe.tableOption.menuClass
      if (Array.isArray(menuClass)){
        return menuClass
      }else if (typeof menuClass == 'string'){
        return  [menuClass]
      }else {
        return  []
      }
    },
    menuSpan () {
      return this.formSafe.parentOption.menuSpan || 24;
    },
    styleName () {
      if (this.menuSpan !== 24) {
        return {
          padding: 0
        }
      }
      return {}
    }
  }
}
</script>
