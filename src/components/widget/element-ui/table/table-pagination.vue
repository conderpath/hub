<template>
  <div
    v-if="validData(acPageTable.tableOption.page,true) && pageFlag"
    :class="b()"
    class="pagination-container"
  >
    <slot name="page" />
    <el-pagination
      :pager-count="defaultPage.pagerCount"
      :current-page.sync="defaultPage.currentPage"
      :background="vaildData(defaultPage.background,true)"
      :page-size="defaultPage.pageSize"
      :page-sizes="defaultPage.pageSizes"
      :layout="defaultPage.layout"
      :total="defaultPage.total"
      @size-change="sizeChange"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
import create from '../../core/utils/create'
import { validData} from "../../core/utils/utils";
export default create({
  name: "pagination",
  inject: ["acPageTable"],
  props: {
    page: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      defaultPage: {
        total: 0, // 总页数
        pagerCount: 7,//超过多少条隐藏
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true // 背景颜色
      }
    };
  },
  created () {
    this.pageInit();
    this.acPageTable.$emit("on-load", this.defaultPage);
  },
  watch: {
    page: {
      handler () {
        this.pageInit();
      },
      deep: true,
    },
    //如果当前页面删除没数据了调用第一页
    'defaultPage.total' () {
      if (this.defaultPage.total === (this.defaultPage.currentPage - 1) * this.defaultPage.pageSize && this.defaultPage.total != 0) {
        this.defaultPage.currentPage = this.defaultPage.currentPage - 1;
        this.acPageTable.$emit("on-load", this.defaultPage);
        this.acPageTable.$emit("current-change", this.defaultPage.currentPage);
        this.updateValue();
      }
    }
  },
  computed: {
    pageFlag () {
      return this.defaultPage.total != 0
    }
  },
  methods: {
    validData,
    pageInit () {
      this.defaultPage = Object.assign(this.defaultPage, this.page, {
        total: Number(this.page.total || this.defaultPage.total),
        pagerCount: Number(this.page.pagerCount || this.defaultPage.pagerCount),
        currentPage: Number(this.page.currentPage || this.defaultPage.currentPage),
        pageSize: Number(this.page.pageSize || this.defaultPage.pageSize)
      })
      this.updateValue();
    },
    updateValue () {
      this.acPageTable.$emit('update:page', this.defaultPage)
    },
    //下一页事件
    nextClick (val) {
      this.acPageTable.$emit("next-click", val)
    },
    //上一页事件
    prevClick (val) {
      this.acPageTable.$emit("prev-click", val)
    },
    // 页大小回调
    sizeChange (val) {
      this.defaultPage.currentPage = 1;
      this.defaultPage.pageSize = val;
      this.updateValue();
      this.acPageTable.$emit("on-load", this.defaultPage);
      this.acPageTable.$emit("size-change", val);
    },
    // 页码回调
    currentChange (val) {
      this.updateValue();
      this.acPageTable.$emit("on-load", this.defaultPage);
      this.acPageTable.$emit("current-change", val);
    }
  }
});
</script>
<style scoped lang="less">
.pagination-container {
  margin-top: 20px;
  text-align: right;
  /deep/.el-pagination__editor.el-input {
    width: 50px !important;
  }
}
</style>
