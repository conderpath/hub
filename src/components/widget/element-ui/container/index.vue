<template>
    <el-container :class="[b(),...vaildData(parentOption.class,[])]" :direction="vaildData(parentOption.direction,'vertical')"
                  :style="{'min-height':vaildData(parentOption.minHeight,0)+'px', 'min-width':vaildData(parentOption.minWidth,0)+'px',
                   width:vaildData(parentOption.width,'auto'), height:vaildData(parentOption.height,'auto'),
                 'overflow-y':vaildData(parentOption.scrollY,'auto'), 'overflow-x':vaildData(parentOption.scrollX,'auto')}">
      <template v-for="(column,index) in columnOption">
        <temp :option="column" :key="index"></temp>
      </template>
    </el-container>
</template>

<script>
import create from "../../core/utils/create";
import temp from '../components/temp'
import AcHeader from './header'

export default create({
  name: "container",
  components:{
    temp,
    AcHeader
  },
  props: {
    /*direction: {
      type: String,
      default: ''
    },
    minHeight: {
      type: Number,
      default: 0
    },
    minWidth: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    scrollX: {
      type: Boolean,
      default: true
    },*/
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