<template>
  <div slot="header"
       :class="b('title')"
       v-if="vaildData($parent.tableOption.title,false) || vaildData($parent.tableOption.dateBtn,config.dateBtn)">
    <p>{{$parent.tableOption.title}}</p>
    <ac-date type="dategroup"
               @change="dateChange"
               v-if="vaildData($parent.tableOption.dateBtn,config.dateBtn)"
               :default="vaildData($parent.tableOption.dateDefault,config.dateDefault)"
               :size="$parent.isMediumSize"></ac-date>
  </div>
</template>

<script>
import create from "../../core/utils/create";
import config from "./config";
import { vaildData } from "../../core/utils/utils";
export default create({
  name: "crud",
  data() {
    return {
      config: config
    };
  },
  created() {
    this.vaildData = vaildData;
  },
  methods: {
    //日期组件回调
    dateChange(val) {
      this.$parent.$emit("date-change", val);
    }
  }
});
</script>
