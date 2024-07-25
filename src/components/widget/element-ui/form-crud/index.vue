<template>
  <div :class="b()">
    <ac-crud  ref="crud"
             :option="option"
             :data="text"
             :page.sync="page"
              :search.sync="search"
              v-loading="loading"
              :permission="getPermission"
             @on-load="onList"
             @row-save="rowSave"
             @row-del="rowDel"
             @row-update="rowUpdate">
      <template v-for="item in columnHeaderSlot"
                slot-scope="scope"
                :slot="getSlotName(item,'H')">
        <slot v-bind="scope"
              :name="getSlotName(item,'H')"></slot>
      </template>

      <template v-for="item in columnSlot"
                slot-scope="scope"
                :slot="item.prop">
        <slot v-bind="scope"
              :name="item.prop"></slot>
      </template>

      <template v-for="item in columnSlot"
                slot-scope="scope"
                :slot="getSlotName(item,'F')">
        <slot v-bind="scope"
              :name="getSlotName(item,'F')"></slot>
      </template>
    </ac-crud>
  </div>
</template>

<script>
import create from "../../core/utils/create";
import props from "../../core/mixins/props";
import event from "../../core/mixins/event";

export default create({
  name: "form-crud",
  mixins: [props(), event()],
  props:{
    onLoad: Function,
    children: {
      type: Object,
      default: () => {
        return {}
      }
    },
    columnSlot: {
      type: Array,
      default: () => {
        return []
      }
    },
    columnHeaderSlot: {
      type: Array,
      default: () => {
        return []
      }
    },
    detail:{
      type:Boolean,
      default:false
    },
    permission: {
      type: [Function, Object],
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      page: {},
      loading:false,
      search:{}
    }
  },
  computed:{
    columnOption () {
      return this.children.column || []
    },
    option () {
      return Object.assign({
        size: this.size,
        disabled: this.disabled,
        readonly: this.readonly,
        header: !this.detail,
        headerLeft: !this.detail,
        menu:!this.detail,
        page:false
      }, (() => {
        let option = this.deepClone(this.children)
        delete option.column;
        return option;
      })(), (() => {
        let list = []
        this.columnOption.forEach(ele => {
          list.push(ele)
        })
        return {
          column: list
        }
      })())
    }
  },
  methods:{
    rowDone(done){
      done && done()
      this.onList()
    },
    rowSave(row,done,loading){
       this.$emit('row-save',row,()=>this.rowDone(done),loading)
    },
    rowUpdate(row,index,done,loading){
      this.$emit('row-update',row,index,()=>this.rowDone(done),loading)
    },
    rowDel(row,index){
      this.$emit('row-del',row,index,()=>this.rowDone())
    },
    onList(){
      if (typeof this.onLoad == 'function') {
        this.loading = true;
        this.onLoad({page: this.page, search: this.search}, data => {
          this.page.total = data.total;
          this.text = data.data
          this.loading = false;
          if (this.$refs.crud && this.$refs.crud.dicInit){
            this.$refs.crud.dicInit('cascader')
          }
        })
      }
    },
    getPermission(key, row, index) {
      if (typeof this.permission === "function") {
        return this.permission(key, row, index)
      } else if (!this.validatenull(this.permission[key])) {
        return this.permission[key]
      } else {
        return true;
      }
    }
  }
})
</script>

<style scoped lang="less">

</style>