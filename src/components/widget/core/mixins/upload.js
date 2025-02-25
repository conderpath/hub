import { getAsVal } from "../utils/utils.js";

function getFileUrl (home, uri = '') {
  return uri.match(/(^http:\/\/|^https:\/\/|^\/\/|data:image\/)/) ? uri : home + uri
};
export default function () {
  return {
    data () {
      return {
        res: '',
        loading: false,
        text: [],
        file: {}
      }
    },
    props: {
      data: {
        type: Object,
        default: () => {
          return {}
        }
      },
      onRemove: Function,
      showFileList: {
        type: Boolean,
        default: true
      },
      autoUpload:{
        type: Boolean,
        default: true
      },
      oss: {
        type: String
      },
      limit: {
        type: Number,
        default: 10
      },
      headers: {
        type: Object,
        default: () => {
          return {}
        }
      },
      accept: {
        type: [String, Array],
        default: ""
      },
      canvasOption: {
        type: Object,
        default: () => {
          return {};
        }
      },
      fileSize: {
        type: Number
      },
      drag: {
        type: Boolean,
        default: false
      },
      loadText: {
        type: String,
        default: "文件上传中,请稍等"
      },
      action: {
        type: String,
        default: ""
      },
      uploadBefore: Function,
      uploadAfter: Function,
      uploadDelete: Function,
      uploadPreview: Function,
      uploadError: Function,
      uploadExceed: Function,
      httpRequest: Function
    },
    computed: {
      isMultiple () {
        return this.isArray || this.isString || this.stringMode
      },
      acceptList () {
        if (Array.isArray(this.accept)) {
          return this.accept.join(',')
        }
        return this.accept
      },
      homeUrl () {
        return this.propsHttp.home || ''
      },
      allParams () {
        if (this.$typeList.video.test(this.imgUrl)) {
          return Object.assign({
            is: 'video'
          }, this.params)
        }
        return this.params
      },
      fileName () {
        return this.propsHttp.fileName || 'file'
      },
      isAliOss () {
        return this.oss === "ali";
      },
      isQiniuOss () {
        return this.oss === "qiniu";
      },
      isPictureImg () {
        return this.listType === "picture-img";
      },
      //单个头像图片
      imgUrl () {
        if (!this.validatenull(this.text)) {
          return getFileUrl(this.homeUrl, this.text[0]);
        }
      },
      fileList () {
        let list = [];
        (this.text || []).forEach((ele, index) => {
          if (ele) {
            let name;
            //处理单个url链接取最后为label
            if (this.isMultiple) {
              let i = ele.lastIndexOf('/');
              name = ele.substring(i + 1);
            }
            list.push({
              uid: index + '',
              status: 'done',
              isImage: ele.isImage || this.$typeList.img.test(ele[this.valueKey]),
              name: this.isMultiple ? name : ele[this.labelKey],
              url: getFileUrl(this.homeUrl, this.isMultiple ? ele : ele[this.valueKey]),
              _file: ele
            });
          }
        });
        return list;
      }
    },
    methods: {
      handleSuccess (file) {
        if (this.isPictureImg) {
          this.text.splice(0, 1, file[this.urlKey])
        } else if (this.isMultiple) {
          this.text.push(file[this.urlKey]);
        } else {
          let obj = {};
          obj[this.labelKey] = file[this.nameKey];
          obj[this.valueKey] = file[this.urlKey];
          this.text.push(obj);
        }
      },
      handleRemove (file, fileList) {
        this.onRemove && this.onRemove(file, fileList);
        this.delete(file);
      },
      handleError (error) {
        this.uploadError && this.uploadError(error, this.column)
      },
      delete (file) {
        (this.text || []).forEach((ele, index) => {
          if ((this.isMultiple ? ele : ele[this.valueKey]) === file.url.replace(this.homeUrl, '')) {
            this.text.splice(index, 1);
          }
        });
      },
      show (data) {
        this.loading = false;
        this.handleSuccess(data || this.res);
      },
      hide (msg) {
        this.loading = false;
        this.handleError(msg);
      },
      handleFileChange (file, fileList) {
       // fileList.splice(fileList.length - 1, 1);
      },
      httpUpload (config) {
        if (typeof this.httpRequest === "function") {
          this.httpRequest(config)
          return
        }
        this.loading = true;
        let file = config.file;
        const fileSize = file.size / 1024;
        this.file = config.file;
        if (!this.validatenull(fileSize) && fileSize > this.fileSize) {
          this.hide("文件太大不符合");
          return;
        }
        const headers = Object.assign(this.headers, { "Content-Type": "multipart/form-data" });
        //oss配置属性
        let oss_config = {};
        let client = {};
        let param = new FormData();
        const done = () => {
          const callback = (newFile) => {
            let url = this.action;
            //附加属性
            for (let o in this.data) {
              param.append(o, this.data[o]);
            }
            const uploadfile = newFile || file;
            param.append(this.fileName, uploadfile);
            (() => {
              if (this.isAliOss) {
                return client.put(uploadfile.name, uploadfile, {
                  headers: this.headers
                });
              } else {
                if (!window.axios) {
               /*   packages.logs('axios');*/
                  return Promise.reject()
                }
                return this.$axios.post(url, param, { headers });
              }
            })()
              .then(res => {
                this.res = {};
                if (this.isQiniuOss) {
                  res.data.key = oss_config.url + res.data.key;
                }

                if (this.isAliOss) {
                  this.res = getAsVal(res, this.resKey);
                } else {
                  this.res = getAsVal(res.data, this.resKey);
                }

                if (typeof this.uploadAfter === "function")
                  this.uploadAfter(
                    this.res,
                    this.show,
                    () => {
                      this.loading = false;
                    },
                    this.column
                  );
                else this.show(this.res);
              })
              .catch(error => {
                if (typeof this.uploadAfter === "function")
                  this.uploadAfter(error, this.hide, () => {
                    this.loading = false;
                  }, this.column);
                else this.hide(error);
              });
          };
          if (typeof this.uploadBefore === "function")
            this.uploadBefore(this.file, callback, () => {
              this.loading = false;
            }, this.column);
          else callback();
        };
        //是否开启水印
/*        if (!this.validatenull(this.canvasOption)) {
          detailImg(file, this.canvasOption).then(res => {
            file = res;
            done();
          });
        } else {
          done();
        }*/
        done();
      },
      handleExceed (files, fileList) {
        this.uploadExceed && this.uploadExceed(this.limit, files, fileList, this.column);
      },
      handlePreview (file) {
        const callback = () => {
          let url = file.url
          let list = this.fileList.map(ele => Object.assign(ele, {
            type: this.$typeList.video.test(ele.url) ? 'video' : ''
          }))
          let index = this.fileList.findIndex(ele => {
            return ele.url === url;
          })
          if (!this.$isVan) {
            this.$ImagePreview(list, index);
          }
        }
        if (typeof this.uploadPreview === "function") {
          this.uploadPreview(file, this.column, callback);
        } else {
          callback();
        }
      },
      handleDelete (file) {
        this.beforeRemove(file).then(() => {
          this.text = [];
          this.menu = false;
        }).catch(() => {
        });
      },
      beforeRemove (file) {
        if (typeof this.uploadDelete === "function") {
          return this.uploadDelete(file, this.column);
        } else {
          return Promise.resolve()
        }
      }
    }
  }
}
