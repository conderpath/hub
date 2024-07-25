<template>
  <el-collapse :class="b()" v-model="activeName" @change="handleChange" :accordion="accordion">
    <el-collapse-item v-for="(item,index) in columnOption" :key="index" :title="item.title" :name="item.name">
      <temp :option="item.children"></temp>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import create from "../../core/utils/create";
import temp from "../components/temp";
export default create({
  name: "collapse",
  components:{
    temp
  },
  props:{
    value:{
      type:[String,Array]
    },
    accordion:{
      type: Boolean,
      default:false
    },
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
      activeName:[],
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
    value :{
      handler(val){
        this.activeName = val
      },
      immediate: true,
      deep:true,
    },

  },
  methods: {
    handleChange (activeNames) {
      this.$emit('input', activeNames)
      this.$emit('change', activeNames)
    },
  }
})
</script>

<style scoped lang="less">

</style>