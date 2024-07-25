<template>
  <div :class="b()">
    <el-tabs v-model="active"
             :tab-position="parentOption.position"
             :type="parentOption.type"
             :closable="parentOption.closable"
             :addable="parentOption.addable"
             :editable="parentOption.editable"
             :stretch="parentOption.stretch"
             @tab-click="handelTabClick"
             @tab-remove="handelTabRemove"
             @tab-add="handelTabAdd"
             @edit="handelEdit">
      <el-tab-pane :name="index+''"
                   :disabled="column.disabled"
                   :closable="column.closable"
                   v-for="(column,index) in columnOption"
                   :key="index">
        <span slot="label">
          <i :class="column.icon"></i>&nbsp;
          {{column.label}}
        </span>

        <template v-if="column.children">
          <temp :option="column.children"></temp>
        </template>

      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import create from "../../core/utils/create";
import temp from "../components/temp";
export default create({
  name: "tabs",
  components:{
    temp
  },
  props: {
    tabRemove:Function,
    tabClick:Function,
    tabAdd:Function,
    edit:Function,
    option: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      active: "0",
    };
  },
  watch: {
    active () {
      this.$emit("change", this.tabsObj);
    }
  },
  computed: {
    tabsObj () {
      return this.columnOption[this.active];
    },
    parentOption () {
      return this.option;
    },
    columnOption () {
      return this.parentOption.column || [];
    }
  },
  methods: {
    changeTabs (active) {
      this.active = active + "";
    },
    handelTabRemove(name){
      if (typeof this.tabRemove == 'function') {
        this.tabRemove(name)
      }
      this.$emit("tabRemove", name);
    },
    handelTabClick(tab){
      if (typeof this.tabClick == 'function') {
        this.tabClick(tab)
      }
      this.$emit("tabClick", tab);
    },
    handelTabAdd(){
      if (typeof this.tabAdd == 'function') {
        this.tabAdd()
      }
      this.$emit("tabAdd");
    },
    handelEdit(targetName,action){
      if (typeof this.edit == 'function') {
        this.edit(targetName,action)
      }
      this.$emit("edit",targetName,action);
    }
  }
});
</script>


