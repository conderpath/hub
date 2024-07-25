<template>
  <component :is="getComponentTemp(column.type,column.component)"
             v-model="text"
             v-bind="Object.assign(column,$uploadFun(column))"
             v-on="event"
             :column="Object.assign(column,params)"
             :dic="dic"
             :option="column"
             ref="temp"
             :disabled="column.disabled || disabled"
             :readonly="column.readonly || readonly"
             :placeholder="getPlaceholder(column)"
             :props="column.props || props"
             :propsHttp="column.propsHttp || propsHttp"
             :size="column.size || size"
             :type="type || column.type"
             :column-slot="columnSlot"
             :column-header-slot="columnHeaderSlot"
             @keyup.enter.native="enterChange">
    <span v-if="params.html"
          v-html="params.html"></span>
    <template :slot="getSlotName(item,'N')"
              slot-scope="scope"
              v-for="item in columnHeaderSlot">
      <slot :name="getSlotName(item,'N')"
            v-bind="scope"></slot>
    </template>
    <template slot-scope="scope"
              v-for="item in $scopedSlots[getSlotName(column,'T')]?[column]:[]">
      <slot :name="getSlotName(item,'T')"
            v-bind="scope"></slot>
    </template>
    <template :slot="item.prop"
              v-for="item in columnSlot"
              slot-scope="scope">
      <slot v-bind="scope"
            :name="item.prop"></slot>
    </template>
  </component>
</template>

<script>
import create from "../../core/utils/create";
import { getComponentTemp, getPlaceholder } from "../../core/utils/dataformat";
import slot from '../../core/mixins/slot'
export default create({
  name: "temp",
  mixins: [slot],
  props: {
    value: {},
    uploadBefore: Function,
    uploadDelete: Function,
    uploadAfter: Function,
    uploadPreview: Function,
    uploadError: Function,
    uploadExceed: Function,
    columnSlot: {
      type: Array,
      default: () => {
        return []
      }
    },
    columnHeaderSlot:{
      type: Array,
      default: () => {
        return []
      }
    },
    clearable: {
      type: Boolean
    },
    enter: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    propsHttp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    props: {
      type: Object
    },
    dic: {
      type: Array
    },
    placeholder: {
      type: String
    },
    size: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    readonly: {
      type: Boolean
    },
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showPlaceholder:{
      type: Boolean,
      default:true
    }
  },
  data () {
    return {
      first: false,
      text: undefined,
      column:{}
    }
  },
  computed: {
    params () {
      return this.column.params || {}
    },
    event () {
      return this.column.event || {}
    }
  },
  watch: {
    text: {
      handler (val) {
        if (this.first || !this.validatenull(val)) {
          this.first = true;
          this.$emit('input', val);
          this.$emit('change', val)
        } else {
          this.first = true;
        }
      }
    },
    value: {
      handler (val) {
        this.text = val;
      },
      immediate: true
    },
    option:{
      handler(val){
        this.column = val
      },
      immediate:true,
      deep:true
    }
  },
  methods: {
    getComponentTemp,
    getPlaceholder,
    enterChange () {
      if (this.enter) this.$emit('enter')
    }
  }
})
</script>

<style scoped lang="less">

</style>