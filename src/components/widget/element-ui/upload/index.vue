<template>
  <div :class="b()" v-loading.lock="loading">
    <el-upload :class="b({'list':listType=='picture-img','upload':disabled})"
               ref="upload"
               @click.native="handleClick"
               :action="action"
               :on-remove="handleRemove"
               :accept="acceptList"
               :before-remove="beforeRemove"
               :multiple="multiple"
               :on-preview="handlePreview"
               :limit="limit"
               :http-request="httpUpload"
               :drag="drag"
               :readonly="readonly"
               :show-file-list="isPictureImg?false:showFileList"
               :list-type="listType"
               :on-change="handleFileChange"
               :on-exceed="handleExceed"
               :disabled="disabled"
               :auto-upload="autoUpload"
               :file-list="fileList">
      <template v-if="listType=='picture-card'">
        <i class="el-icon-plus"></i>
      </template>
      <template v-else-if="listType=='picture-img'">
        <slot v-if="$scopedSlots.default"
              :file="{url:imgUrl}"></slot>
        <template v-else>
          <img v-if="imgUrl"
               :src="imgUrl"
               v-bind="allParams"
               @mouseover="menu=true"
               :class="b('avatar')" />
          <i v-else
             class="el-icon-plus"
             :class="b('icon')"></i>
          <div class="el-upload-list__item-actions"
               :class="b('menu')"
               v-if="menu"
               @mouseover="menu=true"
               @mouseout="menu=false"
               @click.stop="()=>{return false}">
            <i class="el-icon-zoom-in"
               @click.stop="handlePreview({url:imgUrl})"></i>
            <i class="el-icon-delete"
               v-if="!disabled"
               @click.stop="handleDelete(imgUrl)"></i>
          </div>
        </template>
      </template>
      <template v-else-if="drag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{t('upload.tip')}}
          <em>{{t('upload.upload')}}</em>
        </div>
      </template>
      <template v-else>
        <el-button size="small"
                   type="primary">{{t('upload.upload')}}</el-button>
      </template>
      <div slot="tip"
           class="el-upload__tip">{{tip}}</div>
      <template v-if="$scopedSlots.default"
                slot="file"
                slot-scope="scope">
        <slot v-bind="scope"></slot>
      </template>
    </el-upload>
  </div>
</template>

<script>
import create from "../../core/utils/create";
import props from "../../core/mixins/props.js";
import event from "../../core/mixins/event.js";
import locale from "../../core/mixins/locale";
import upload from '../../core/mixins/upload'
export default create({
  name: "upload",
  mixins: [props(), event(), upload(), locale],
  data () {
    return {
      menu: false,
    };
  }
});
</script>
