<template>
  <el-row :class="[b(),...vaildData(parentOption.classList,[])]"
          :gutter="vaildData(parentOption.gutter,0)"
          :type="vaildData(parentOption.type,'-')"
          :justify="vaildData(parentOption.justify,'start')"
          :align="vaildData(parentOption.align,'-')"
          :tag="vaildData(parentOption.tag,'div')"
  >
    <el-col v-for="(column,index) in columnOption"
            :key="index"
            :span="vaildData(column.span,12)"
            :offset="vaildData(column.offset,0)"
            :push="vaildData(column.push,0)"
            :pull="vaildData(column.pull,0)"
            :tag="vaildData(column.tag,'div')">
      <temp :option="column.children"></temp>

<!--      :xs="vaildData(column.xs,24)"
      :sm="vaildData(column.sm,24)"
      :md="vaildData(column.md,12)"
      :lg="vaildData(column.lg,12)"
      :xl="vaildData(column.xl,6)"-->
    </el-col>
  </el-row>
</template>

<script>
import create from "../../core/utils/create";
import temp from "../components/temp";
export default create({
  name: "row",
  components:{
    temp
  },
  props:{
    option: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    parentOption () {
      return this.option;
    },
    columnOption () {
      return this.parentOption.column || [];
    }
  },
})
</script>

<style scoped lang="less">

</style>