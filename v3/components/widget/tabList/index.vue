<template>
 <div>
   <el-tabs :model-value="list[0].title">
     <el-tab-pane v-for="(tab, index) in list" :key="index" :label="tab.title" :name="tab.title">
       <el-scrollbar max-height="400">
        <div class="container" v-for="(item,idx) in tab.content">
         <div v-if="item.avatar" class="avatar"><el-avatar :size="30" :src="item.avatar" /></div>
         <div class="content">
           <div class="title" v-if="item.title">
             <div>{{item.title}}</div>
             <el-tag v-if="item.tag" :type="item.tagType">{{item.tag}}</el-tag>
           </div>
           <div class="desc">{{item.desc}}</div>
           <div class="time">{{item.time}}</div>
         </div>
       </div>
       </el-scrollbar>
     </el-tab-pane>

   </el-tabs>
 </div>
</template>

<script setup>
defineProps({
  list: {
    type: Array,
    default:()=> []
  },
  actions: {
    type: Array,
    default: ()=> []
  }
})
</script>

<style lang="less" scoped>
.container{
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  .avatar{
    flex: 1;
    text-align: center;
  }
  &:hover{
    background: lightblue;
  }
  .content{
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex: 3;
    .title{
      display: flex;
      align-content: center;
      justify-content: space-between;
    }
    .time{
      color: #999;
    }
  }
}
</style>