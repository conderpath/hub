<template>
  <div :class="b()">
  <el-steps :active="active"
            :simple="parentOption.simple"
            :space="parentOption.space"
            :direction="parentOption.direction"
            :process-status="parentOption.processStatus"
            :finish-status="parentOption.finishStatus"
            :align-center="parentOption.alignCenter">

    <el-step  :title="column.title" :icon="column.icon"
              :description="column.description"
              :status="column.status"
              v-for="(column,index) in columnOption"
              :key="index">
    </el-step>

  </el-steps>

    <template  v-for="(column,index) in columnOption">
      <temp :key="index" v-if="column.children && active === index" :option="column.children"></temp>
    </template>
  </div>
</template>

<script>
import create from "../../core/utils/create";
import temp from "../components/temp";
export default create({
  name: "steps",
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
    return {
      active:0
    }
  },
  computed: {
    parentOption () {
      return this.option;
    },
    columnOption () {
      return this.parentOption.column || [];
    }
  },
  watch: {
    active () {
      this.$emit("change", this.active);
    }
  },
})
</script>

<style scoped lang="less">

</style>