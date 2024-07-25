<template>
  <div class="page_search_form">
    <el-form
      ref="form"
      :model="model"
      status-icon
      label-width="100px"
      class="page_form"
    >
      <el-row>
        <el-col
          v-for="(item,index) in fields"
          v-show="index<count || showFlag"
          :key="item.prop"
          :span="span"
        >
          <el-form-item
            :label="$t(`${item.label}`)"
            :prop="item.prop"
          >
            <el-input
              v-if="isType(item,'input')"
              v-model="model[item.prop]"
              autocomplete="off"
            />
            <el-select
              v-if="isType(item,'select')"
              v-model="model[item.prop]"
              autocomplete="off"
              :clearable="item.clearable||true"
              @change="getEvents(item)"
            >
              <el-option
                v-for="option in item.options"
                :key="option[item['optVal']||'id']"
                :value="option[item['optVal']||'id']"
                :label="option[item['optLabel']||'name']"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="span" class="fr">
          <div class="page_btn_group">
            <el-button
              class="form_btn form_btn_search"
              type="primary"
              icon="el-icon-search"
              @click="onSearchBtnClick"
            >
              {{ $t('button.query') }}
            </el-button>
            <el-button
              class="form_btn form_btn_reset"
              icon="el-icon-refresh-left"
              @click="onResetBtnClick"
            >
              {{ $t('button.reset') }}
            </el-button>
            <el-button v-if="showToggle" type="text" @click="showFlag = !showFlag">
              <i class="arrow" :class="showFlag?'el-icon-arrow-up':'el-icon-arrow-down'" />{{ msg }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// import moduleName from 'module'

export default {
  name: '',
  components: {

  },
  props: {
    fields: {
      type: Array,
      default () {
        return {}
      }
    },
    model: {
      type: Object,
      default () {
        return {}
      }
    },
    span: {
      type: Number,
      default: 6
    },
    searchIndex: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  computed:{
    count() {
      // return Math.min(this.searchIndex,24/this.span -1)
      return this.searchIndex
    },
    spans() {
      return window.screen.width>1440? 6:8
    },
    showToggle() {
      return this.fields.length - this.count >0
    },
    msg() {
      return this.showFlag ? '收 起': '展 开'
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    isType (field, type) {
      return (field.type || 'input') === type
    },
    getEvents (col) {
      const evt = col?.events?.onChange
      if (evt) {
        evt(this.model[col.prop])
      }
    },
    onResetBtnClick () {
      this.$refs.form.resetFields()
    },
    onSearchBtnClick () {
      this.$emit('query', 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.page_search_form{
  .arrow{
    margin-right: 6px;
  }
  .fr{
    float: right;
  }
}
</style>
