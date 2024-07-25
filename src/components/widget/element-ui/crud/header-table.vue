<template>
  <div :class="b()">
    <template v-if="vaildData(crud.tableOption.headers)">
      <template v-for="(item,index) in vaildData(crud.tableOption.headers.list,[])">
        <component  :is="crud.tableOption.headers.getComponent(item.component)"
                    v-if="vaildData(item.show,true)"
                    v-bind="item"
                    v-on="item.event">
          {{item.text}}
        </component>
      </template>
    </template>
    <slot name="header"></slot>
  </div>
</template>

<script>
import create from "../../core/utils/create";

export default create({
  name: "header-table",
  inject: ["crud"],
  data() {
    return {}
  }
})
</script>

<style scoped lang="less">

</style>