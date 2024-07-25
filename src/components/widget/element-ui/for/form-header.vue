<template>
  <div :class="b()" v-if="showFormHeader">
    <div :class="b('left')">
      <template v-if="vaildData(formSafe.parentOption.menuLeft)">
        <template v-for="(item,index) in vaildData(formSafe.parentOption.menuLeft.menus,[])">
          <component  :is="formSafe.parentOption.menuLeft.getComponent(item.component)"
                      v-if="vaildData(item.show,true)"
                      v-bind="item"
                      v-on="item.event">
            {{item.text}}
          </component>

        </template>
      </template>





      <slot name="headerLeft"
            :size="formSafe.controlSize"></slot>
    </div>
    <div :class="b('right')">
      <template v-if="vaildData(formSafe.parentOption.menuRight)">
        <template v-for="(item,index) in vaildData(formSafe.parentOption.menuRight.menus,[])">
          <component  :is="formSafe.parentOption.menuRight.getComponent(item.component)"
                      v-if="vaildData(item.show,true)"
                      v-bind="item"
                      v-on="item.event">
            {{item.text}}
          </component>
        </template>
      </template>
<!--      <template v-for="(menu,index) in vaildData(formSafe.parentOption.menuRight,[])">
        <el-button
            :key="index"
            v-if="vaildData(menu.show,true)"
            :type="vaildData(menu.type,'')"
            :icon="menu.icon"
            :size="vaildData(menu.size, formSafe.controlSize)"
            :plain="vaildData(menu.plain,false)"
            :round="vaildData(menu.round,false)"
            :disabled="vaildData(menu.disabled,false)"
            @click.stop="()=>{menu.click && menu.click()}">
          {{ vaildData(menu.btnText, '')}}
        </el-button>
      </template>-->

      <slot name="headerRight"
            :size="formSafe.controlSize"></slot>
    </div>
  </div>
</template>

<script>
import create from "../../core/utils/create";

export default create({
  name: "form-header",
  inject: ["formSafe"],
  data() {
    return {}
  },
  computed:{
    showFormHeader(){
     return  this.vaildData(this.formSafe.parentOption.menuLeft) && this.formSafe.parentOption.menuLeft.menus.some((item)=>item.show)
      || this.vaildData(this.formSafe.parentOption.menuRight) && this.formSafe.parentOption.menuRight.menus.some((item)=>item.show)
    }
  },
})
</script>

<style scoped lang="less">
  .ac-form-header{
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #fff;
  }
</style>