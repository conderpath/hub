<template>
  <div :class="b()">
    <el-radio-group v-model="text"
                    :size="size"
                    @change="handleChange"
                    @click.native="handleClick"
                    :disabled="disabled">
      <component :is="componentName"
                 v-for="(item,index) in dic"
                 :label="item[valueKey]"
                 :border="border"
                 :readonly="readonly"
                 :disabled="item[disabledKey]"
                 :key="index">{{item[labelKey]}}</component>
    </el-radio-group>
  </div>
</template>

<script>
import create from "../../core/utils/create";
import props from "../../core/mixins/props.js";
import event from "../../core/mixins/event.js";
export default create({
  name: "radio",
  mixins: [props(), event()],
  data () {
    return {
      name: 'radio',
    };
  },
  props: {
    value: {}
  },
  watch: {},
  created () { },
  mounted () { },
  methods: {}
});
</script>