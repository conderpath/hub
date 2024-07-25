<template>
  <el-collapse-transition>
      <el-card
          v-show="searchShow && searchFlag"
          :shadow="acPageTable.isShadow"
          :class="b()"
      >
        <ac-form
            ref="form"
            v-model="searchForm"
            :option="option"
            @submit="searchChange"
            @change="handleChange"
            @reset-change="resetChange">
          <template slot="menuForm" slot-scope="scope">
            <slot
                name="searchMenu"
                v-bind="Object.assign(scope,{
              search:searchForm,
              row:searchForm
            })"
            />
            <template v-if="isSearchIcon">
              <el-button type="text"
                         v-if="show===false"
                         @click="show=true"
                         icon="el-icon-arrow-down">{{$t('crud.open')}}</el-button>
              <el-button type="text"
                         v-if="show===true"
                         @click="show=false"
                         icon="el-icon-arrow-up">{{$t('crud.shrink')}}</el-button>
            </template>
          </template>
          <template v-for="item in acPageTable.searchSlot" :slot="item.prop" slot-scope="scope">
            <slot
                :name="item.prop"
                v-bind="Object.assign(scope,{
              search:searchForm,
              row:searchForm
            })"
            />
          </template>
        </ac-form>
      </el-card>
  </el-collapse-transition>
</template>

<script>
import create from '../../core/utils/create'
import common from "../../core/mixins/common";
import {deepClone, validData,validatenull} from "../../core/utils/utils";

export default create({
  name: "header-search",
  inject: ["acPageTable"],
  props: {
    search: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mixins: [common],
  data() {
    return {
      searchForm:{},
      searchShow:true,
      show:false
    }
  },
  computed: {
    option() {
      const option = this.acPageTable.tableOption;
      const detailColumn = (list = []) => {
        let column = [];
        let count = 0
        list.forEach(ele => {
          if (ele.search) {
            let isCount = count < this.searchIndex
            ele = Object.assign(ele, {
              type: this.getSearchType(ele),
              span: ele.searchSpan || option.searchSpan || 6,
              xlSpan:ele.searchXlSpan || option.searchXlSpan || 6,
              gutter: ele.searchGutter || option.searchGutter || 20,
              labelWidth: ele.searchLabelWidth || option.searchLabelWidth || 80,
              placeholder: this.getPlaceholder(ele, 'search'),
              row: ele.searchRow,
              size: ele.searchSize || option.searchSize || 'small',
              clearable: ele.searchClearable || true,
              rules: ele.searchRules,
              disabled: ele.searchDisabled,
              readonly: ele.searchReadonly,
              value: ele.searchValue,
              display: this.isSearchIcon ? (this.show ? true : isCount) : true,
            })
            delete ele.bind
            let whiteList = ['disabled', 'readonly']
            whiteList.forEach(key => {
              delete ele[key]
            })
            column.push(ele);
            count = count + 1;
          }
        })
        return column;
      }
      const dataDetail = (list) => {
        let result = deepClone(list);
        result.column = detailColumn(deepClone(option.column))
        result = Object.assign(result, {
          enter: this.validData(option.searchEnter, true),
          size: option.searchSize,
          submitText: option.searchBtnText || this.$t('form.searchBtn'),
          submitBtn: this.validData(option.searchBtn, true),
          submitIcon: option.searchBtnIcon || 'el-icon-search',
          emptyText: option.emptyBtnText || this.$t('form.empty'),
          emptyBtn: option.emptyBtn || true,
          emptyIcon: option.emptyBtnIcon || 'el-icon-refresh-left',
          menuPosition: option.searchMenuPosition || 'right',
          menuClass:(()=>{
           let count = result.column.reduce((total, current,currentIndex)=>{
             if (this.isSearchIcon){
                if (currentIndex < this.searchIndex){
                  return total + current.span;
                } else {
                  return total + 0;
                }
             } else {
               return total + current.span;
             }
           },0)
           if (Math.ceil(count%24) >= 6){
             return 'search-header-menu'
           }
           return ''
          })()
        })
        return result;
      }
      let result = dataDetail(option)
      return result;
    },
    searchFlag () {
      return !validatenull(this.searchForm);
    },
    columnLen () {
      let count = 0;
      this.acPageTable.columnFormOption.forEach(ele => {
        if (ele.search) count++
      })
      return count
    },
    isSearchIcon () {
      return this.vaildData(this.acPageTable.option.searchIcon, false) === true && this.columnLen > this.searchIndex
    },
    searchIndex () {
      return this.acPageTable.option.searchIndex || 2
    },
  },
  watch:{
    search: {
      handler () {
        this.searchForm = Object.assign(this.searchForm, this.search);
      },
      immediate: true,
      deep: true
    },
    'acPageTable.tableOption': {
      handler () {
        this.searchShow = validData(this.acPageTable.tableOption.searchShow, true);
      },
      immediate: true,
      deep:true
    },
  },
  created() {
    this.initFun()
  },
  methods: {
    validData,
    initFun () {
      ['searchReset', 'searchChange'].forEach(ele => this.acPageTable[ele] = this[ele])
    },
    // 搜索回调
    searchChange (form, done) {
      this.acPageTable.$emit("search-change", form, done);
    },
    handleChange () {
      this.acPageTable.$emit('update:search', this.searchForm)
    },
    // 搜索清空
    resetChange () {
      let defaultForm = this.formInitVal(this.option.column).tableForm
      this.searchForm = deepClone(defaultForm) ;
      this.acPageTable.$emit("search-reset", defaultForm);
    },
    // 搜索清空
    searchReset () {
      this.$refs.form.resetForm();
    },
    handleSearchShow () {
      this.searchShow = !this.searchShow;
    },
  }

})
</script>

<style scoped lang="less">
/deep/.search-header-menu{
  float: right;
  width: auto;
}

/deep/.ac-form__group--flex{
  display: block;
}

.header-search-container {

}
</style>
