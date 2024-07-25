<template>
  <el-main :class="[b(),...vaildData(parentOption.class,[])]" :style="{'min-height':vaildData(parentOption.minHeight,0)+'px', 'min-width':vaildData(parentOption.minWidth,0)+'px',
                   width:vaildData(parentOption.width,100)+'%', height:vaildData(parentOption.height,100)+'%',backgroundColor:vaildData(parentOption.backgroundColor,'#fff'),
                 'overflow-y':vaildData(parentOption.scrollY,'auto'), 'overflow-x':vaildData(parentOption.scrollX,'auto')}">
    <template v-for="(column,index) in columnOption">
      <temp :option="column" :key="index"></temp>
    </template>
  </el-main>
</template>

<script>
import create from "../../core/utils/create";
import temp from '../components/temp'
export default create({
  name: "main",
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