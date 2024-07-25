<template>
  <div   :class="b()" class="index-container">
      <ac-select v-model="valueData" :dic="dicData" @change="handleChange"></ac-select>
  </div>
</template>

<script>
import create from "../../core/utils/create";
import {apiDataRequest} from "../../core/utils/apiDataRequest";
import {dataCommonInsert} from "../../../../api/apiCommonInsert";

export default create({
  name: "valueset",
  props:{
    dicFormatter:Function,
    value:String,
    code:{
      type: String,
      required: true,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      valueData:'',
      dicData:[]
    }
  },
  watch:{
    value:{
      handler(val){
        this.valueData = val
      },
      immediate:true
    },
    code:{
      handler(val){
        this.getList(val)
      },
      immediate:true,
      deep:true
    }
  },
  methods:{
    getList(val){
      let data = {
        filterFields:[
          { conditionOperator: "=", fieldName: "parentCode", relationship: "AND", value: [val]}
        ],
        orderFields:[{fieldName: "code", order: "ASC"}],
      }
      apiDataRequest.request({
        api: 'businessWidget.valueset.valueset',
        method:'post',
        data: dataCommonInsert(data)
      }).then((res)=>{
        let result = res.data;
        this.dicData = this.dicFormatter && this.dicFormatter(result)  || result.map((item)=>{
          return {
            value:item.code,
            label:item.value
          }
        })
      })
    },
    handleChange(result){
      this.$emit('input', result);
      this.$emit('change', result);
    }
  }
})
</script>

<style scoped lang="less">
.index-container{
  display: inline-block;
}

</style>