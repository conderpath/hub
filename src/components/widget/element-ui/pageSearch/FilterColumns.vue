<template>
  <div ref="filterRef" class="filter-columns" :class="visible?'z12':''">
    <el-popover placement="bottom-end" trigger="hover">
      <div class="column-list">
        <el-table :data="filterColumns" style="width: 220px;">
          <el-table-column prop="label" :label="$t('common.fields.column')">
            <template slot-scope="{row}">
              {{ $t(row.label) }}
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" :label="$t('common.fields.hide')">
            <template slot-scope="{row}">
              <el-checkbox v-model="checked" :label="row.prop" @change="handleItemChange">
                {{ '' }}
              </el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-tooltip
        slot="reference"
        effect="dark"
        :content="$t('common.tips.hideTip')"
        placement="top"
      >
        <div class="set-column">
          <span class="ac-icon-icon-set-colomn"></span>
        </div>
      </el-tooltip>
    </el-popover>
    <!--  <el-button circle icon="ac-icon-icon-hide-search" @click.stop="onClickShowForm">
    </el-button> -->
    <el-tooltip
      :content="$t('common.tips.switchCondition')"
      placement="top"
    >
      <div
        class="hide-search"
        @click="onClickShowForm"
      >
        <span class="ac-icon-icon-hide-search iconfont"></span>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
// import moduleName from 'module'

export default {
  name: 'FilterColumns',
  components: {

  },
  props: {
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    showForm: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      filterColumns: [],
      checkAll: false,
      isIndeterminate: false,
      checked: [],
      visible: false
    }
  },
  watch: {
    columns: {
      handler (arr) {
        const skips = ['index', 'selection', 'radio', 'action']
        this.filterColumns = arr.filter(item => !skips.includes(item.type))
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    document.addEventListener('click', this.hide)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.hide)
  },
  created () {

  },
  methods: {
    handleCheckAllChange (checked) {
      this.checked = checked ? this.filterColumns.map(item => item.prop) : []
      this.isIndeterminate = false
      this.$emit('filter', this.checked)
    },
    handleItemChange () {
      if (this.checked.length === this.filterColumns.length && this.checked.length !== 0) {
        this.checkAll = true
        this.isIndeterminate = false
      } else if (this.checked.length) {
        this.isIndeterminate = true
      } else {
        this.checkAll = false
        this.isIndeterminate = false
      }
      this.$emit('filter', this.checked)
    },
    onClickFilter () {
      this.visible = !this.visible
    },
    hide (e) {
      if (!this.$refs.filterRef.contains(e.target)) {
        this.visible = false
      }
    },
    onClickShowForm () {
      this.visible = false
      this.$emit('update:showForm', !this.showForm)
    }
  },
}
</script>

<style lang="scss" scoped>
.filter-columns {
  //  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .set-column {
    margin-right: 12px;
  }
  .set-column,
  .hide-search {
    color: #a100ff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    text-align: center;
    border: 1px solid #f9f0ff;
    background-color: #f9f0ff;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 22px;
      position: relative;
      top: 2px;
    }
  }
}
</style>
