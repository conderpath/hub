<template>
  <el-input-number v-model.number="text"
                   :class="b()"
                   @click.native="handleClick"
                   @focus="handleFocus"
                   @blur="handleBlur"
                   :precision="precision"
                   :placeholder="placeholder"
                   :size="size"
                   :min="min"
                   :max="max"
                   :step="step"
                   :clearable="disabled?false:clearable"
                   :readonly="readonly"
                   :controls-position="controlsPosition"
                   :controls="controls"
                   :label="placeholder"
                   :disabled="disabled"></el-input-number>
</template>

<script>
import create from "../../core/utils/create";
import props from "../../core/mixins/props.js";
import event from "../../core/mixins/event.js";
export default create({
  name: "input-number",
  mixins: [props(), event()],
  data () {
    return {};
  },
  props: {
    controls: {
      type: Boolean,
      default: true
    },
    step: {
      type: Number,
      default: 1
    },
    controlsPosition: {
      type: String,
      default: "right"
    },
    precision: {
      type: Number
    },
    min: {
      type: Number,
      default: -Infinity
    },
    max: {
      type: Number,
      default: Infinity
    }
  },
  created () { },
  mounted () { },
  methods: {}
});
</script>