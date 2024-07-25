<template>
  <div class="header-menu-container">
      <div class="left">
        <el-button
            v-if="validData(acPageTable.tableOption.addBtn,true)"
            type="primary"
            :icon="validData(acPageTable.tableOption.addBtnIcon,'el-icon-plus')"
            @click="acPageTable.rowAdd">
          {{ validData(acPageTable.tableOption.addBtnText,$t('form.addBtn')) }}
        </el-button>
        <slot name="headerMenu" />
      </div>
      <div class="right">
        <el-popover placement="bottom-end" v-if="vaildData(acPageTable.tableOption.columnBtn,true)" trigger="hover">
          <div class="column-list">
            <el-table :data="list" style="width: 220px;">
              <el-table-column prop="label" label="列名"></el-table-column>
              <template v-for="(item,index) in defaultColumn">
                <el-table-column :prop="item.prop" :key="index" header-align="center" align="center" :label="item.label">
                  <template slot-scope="{row}">
                    <el-checkbox  v-model="acPageTable.objectOption[row.prop][item.prop]" ></el-checkbox>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </div>
          <el-tooltip effect="dark"
                      slot="reference"
                      :content="$t('crud.showBtn')"
                      placement="top">
          <div class="set-column" >
            <span class="ac-icon-icon-set-colomn iconfont"></span>
          </div>
          </el-tooltip>
        </el-popover>

        <el-tooltip effect="dark"
                    :content="$t('crud.searchBtn')"
                    v-if="(acPageTable.$refs.headerSearch || {}).searchFlag&&vaildData(acPageTable.tableOption.searchShowBtn,true)"
                    placement="top">
          <div class="hide-search"
               @click="acPageTable.$refs.headerSearch.handleSearchShow()">
            <span class="ac-icon-icon-hide-search iconfont"></span>
          </div>
        </el-tooltip>


      </div>
  </div>
</template>

<script>
import create from "../../core/utils/create";
import {deepClone, validData,arraySort} from "../../core/utils/utils";

export default create({
  name: "header-menu",
  inject: ["acPageTable"],
  data() {
    return {
      checkList:[],
      ALL:false,
      defaultColumn: [{
        label: '隐藏',
        prop: 'hide',
        checkList:[]
      }]
    }
  },
  computed: {
    list () {
      let list = [];
/*      this.acPageTable.objectOption.ALL = {label:'全部',prop:'ALL',hide:false}*/
      for (let o in this.acPageTable.objectOption) {
        const ele = this.acPageTable.objectOption[o]
        if (ele.showColumn != false) {
          if (o === 'ALL'){
            list.unshift(Object.assign(ele, { prop: o }))
          }else {
            list.push(Object.assign(ele, { prop: o }))
          }
        }
      }
      list = arraySort(list, 'index', (a, b) => this.acPageTable.objectOption[a.prop]?.index - this.acPageTable.objectOption[b.prop]?.index)
      return list;
    }
  },
  watch:{

  },
  created() {

  },
  methods: {
    validData,
    handleAllChange(val,prop,type){
      if (prop === "ALL"){
        for (let o in this.acPageTable.objectOption) {
          const ele = this.acPageTable.objectOption[o]
          if (ele.showColumn != false) {
            if (o !== "ALL"){
              this.acPageTable.objectOption[o][type] = val
            }
          }
        }
      }
    }
  }
})
</script>

<style scoped lang="less">
@import "../../core/style/variables.less";

.column-list{
  margin: -12px;
  /deep/tbody tr td{
    border-bottom: none;
  }

  /deep/ tbody tr:hover {
    td{
      background-color: @background-theme-color;
    }
  }
}

 .header-menu-container{
   margin-bottom: 10px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   .right{
     display: flex;
     color: @theme-color;

     .set-column{
       margin-right: 12px;
     }
     .set-column,.hide-search{
       width: 36px;
       height: 36px;
       border-radius: 50%;
       text-align: center;
       border:1px solid #F9F0FF;
       background-color: @background-theme-color;
       cursor: pointer;
       display: inline-flex;
       justify-content: center;
       align-items: center;
       span{
         font-size: 22px;
         position: relative;
         top: 2px;
       }
     }
   }
 }
</style>
