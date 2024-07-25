<template>
  <div :class="b()">
    <input :class="b('small')" :placeholder="placeholder" ref="inputRef" type="text"/>
  </div>
</template>

<script>
import create from "../../core/utils/create";
import { useCurrencyInput } from 'vue-currency-input'
import { computed, watch } from '@vue/composition-api'
export default create({
  name: "currency",
  props: {
    value: Number,
    placeholder:String,
    options:{
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  setup(props) {
    const { inputRef , setOptions} = useCurrencyInput(Object.assign({ currency: 'CNY'},props.options))
    watch(
        ()=>props.options,
        (value)=>{
          setOptions(Object.assign({ currency: 'CNY'},value))
        }
    )
    return { inputRef }
  }
})
</script>

<style scoped lang="less">

</style>