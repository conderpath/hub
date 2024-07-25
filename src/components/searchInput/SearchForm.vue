<template>
  <div class="page_search_form">
    <el-form
      ref="form"
      :inline="true"
      :model="model"
      status-icon
      label-width="130px"
      class="page_form"
    >
      <el-row>
        <el-col
          v-for="item in fields"
          :key="item.prop"
          :span="span"
        >
          <el-form-item
            :label="$t(`${item.label}`)"
            :prop="item.prop"
          >
            <el-input
              v-if="isType(item,['input','password'])"
              v-model="model[item.prop]"
              autocomplete="off"
              :type="item.type||'input'"
            />
            <el-select
              v-if="isType(item,['select'])"
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
      </el-row>
    </el-form>
    <div class="page_btn_group">
      <el-button
        class="form_btn form_btn_reset"
        @click="onResetBtnClick"
      >
        重置
      </el-button>
      <el-button
        class="form_btn form_btn_search"
        type="primary"
        @click="onSearchBtnClick"
      >
        查询
      </el-button>
    </div>
  </div>
</template>

<script>
// import moduleName from 'module'

export default {
  name: 'SearchForm',
  components: {

  },
  props:{
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
      default: 12
    }
  },
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    isType (field, types) {
      return types.includes(field.type||'input')
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
.page_btn_group {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
  >:nth-child(n+2) {
    margin-left: 20px;
  }
  .form_btn {
    min-width: 100px;
    height: 40px;
    padding: 10px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 18px;
    }
  }
}
</style>
