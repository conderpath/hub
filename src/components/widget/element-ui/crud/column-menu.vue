<template>
  <!-- 操作栏 -->
  <el-table-column :class="b('btn')"
                   prop="menu"
                   :fixed="vaildData(crud.tableOption.menuFixed,config.menuFixed)"
                   v-if="vaildData(crud.tableOption.menu,config.menu)&&crud.getPermission('menu')"
                   :label="crud.tableOption.menuTitle || t('crud.menu')"
                   :align="crud.tableOption.menuAlign || config.menuAlign"
                   :header-align="crud.tableOption.menuHeaderAlign || config.menuHeaderAlign"
                   :width="crud.isMobile?(crud.tableOption.menuXsWidth || config.menuXsWidth):( crud.tableOption.menuWidth || config.menuWidth)">
    <template slot-scope="{row,$index}">
      <el-dropdown v-if="isMenu"
                   :size="crud.isMediumSize">
        <el-button type="text"
                   :size="crud.isMediumSize">
          {{ crud.tableOption.menuBtnTitle || t('crud.menuBtn')}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :icon="config.viewBtnIcon"
                            v-if="vaildData(crud.tableOption.viewBtn,config.viewBtn)"
                            v-permission="crud.getPermission('viewBtn',row,$index)"
                            @click.native="crud.rowView(row,$index)">{{t('crud.viewBtn')}}</el-dropdown-item>
          <el-dropdown-item :icon="config.editBtnIcon"
                            v-if="vaildData(crud.tableOption.editBtn,config.editBtn)"
                            v-permission="crud.getPermission('editBtn',row,$index)"
                            @click.native="crud.rowEdit(row,$index)">{{t('crud.editBtn')}}</el-dropdown-item>
          <el-dropdown-item :icon="config.copyBtnIcon"
                            v-if="vaildData(crud.tableOption.copyBtn,config.copyBtn)"
                            v-permission="crud.getPermission('copyBtn',row,$index)"
                            @click.native="crud.rowCopy(row)">{{t('crud.copyBtn')}}</el-dropdown-item>
          <el-dropdown-item :icon="config.delBtnIcon"
                            v-if="vaildData(crud.tableOption.delBtn,config.delBtn)"
                            v-permission="crud.getPermission('delBtn',row,$index)"
                            @click.native="crud.rowDel(row,$index)">{{t('crud.delBtn')}}</el-dropdown-item>

          <template v-for="(menu,index) in vaildData(crud.tableOption.menus,[])">
            <el-dropdown-item :icon="menu.icon"
                              :key="index"
                              v-if="vaildData(menu.show,true)"
                              v-permission="crud.getPermission(menu.prop,row,$index)"
                              @click.native.stop="()=>{menu.click && menu.click(row,$index)}">{{vaildData(menu.btnText,'')}}</el-dropdown-item>
          </template>
          <slot name="menuBtn"
                :row="row"
                :type="menuText('primary')"
                :disabled="crud.btnDisabled"
                :size="crud.isMediumSize"
                :index="$index"></slot>
        </el-dropdown-menu>
      </el-dropdown>
      <template v-else-if="['button','text','icon'].includes(menuType)">
        <template v-if="vaildData(crud.tableOption.cellBtn,config.cellBtn)">

          <el-button :type="menuText('primary')"
                     :icon="config.editBtnIcon"
                     :size="crud.isMediumSize"
                     :disabled="crud.btnDisabledList[$index]"
                     @click.stop="crud.rowCell(row,$index)"
                     v-if="vaildData(crud.tableOption.editBtn,config.editBtn)&&!row.$cellEdit"
                     v-permission="crud.getPermission('editBtn',row,$index)">
            <template v-if="!isIconMenu">
              {{crud.menuIcon('editBtn')}}
            </template>
          </el-button>
          <el-button :type="menuText('primary')"
                     :icon="config.saveBtnIcon"
                     :size="crud.isMediumSize"
                     :disabled="crud.btnDisabledList[$index]"
                     @click.stop="crud.rowCell(row,$index)"
                     v-else-if="vaildData(crud.tableOption.saveBtn,config.saveBtn)&&row.$cellEdit"
                     v-permission="crud.getPermission('saveBtn',row,$index)">
            <template v-if="!isIconMenu">
              {{crud.menuIcon('saveBtn')}}
            </template>
          </el-button>
          <el-button :type="menuText('danger')"
                     :icon="config.cancelBtnIcon"
                     :size="crud.isMediumSize"
                     :disabled="crud.btnDisabledList[$index]"
                     @click.stop="crud.rowCancel(row,$index)"
                     v-if="vaildData(crud.tableOption.cancelBtn,config.cancelBtn) && row.$cellEdit">
            <template v-if="!isIconMenu">
              {{crud.menuIcon('cancelBtn')}}
            </template>
          </el-button>
        </template>

        <el-tooltip class="item" :disabled="vaildData(!isIconMenu,true)" effect="dark"
                    :content="crud.menuIcon('viewBtn')"
                    placement="top">
          <el-button :type="menuText('success')"
                     :icon="config.viewBtnIcon"
                     :size="crud.isMediumSize"
                     :disabled="crud.btnDisabledList[$index]"
                     @click.stop="crud.rowView(row,$index)"
                     v-permission="crud.getPermission('viewBtn',row,$index)"
                     v-if="vaildData(crud.tableOption.viewBtn,config.viewBtn)">
            <template v-if="!isIconMenu">
              {{ crud.menuIcon('viewBtn') }}
            </template>
          </el-button>
        </el-tooltip>

        <el-tooltip class="item" :disabled="vaildData(!isIconMenu,true)" effect="dark"
                    :content="crud.menuIcon('editBtn')"
                    placement="top">
        <el-button :type="menuText('primary')"
                   :icon="config.editBtnIcon"
                   :size="crud.isMediumSize"
                   :disabled="crud.btnDisabledList[$index]"
                   @click.stop="crud.rowEdit(row,$index)"
                   v-permission="crud.getPermission('editBtn',row,$index)"
                   v-if="vaildData(crud.tableOption.editBtn,config.editBtn)&&!crud.tableOption.cellBtn">
          <template v-if="!isIconMenu">
            {{crud.menuIcon('editBtn')}}
          </template>
        </el-button>
        </el-tooltip>

        <el-tooltip class="item" :disabled="vaildData(!isIconMenu,true)" effect="dark"
                    :content="crud.menuIcon('copyBtn')"
                    placement="top">
        <el-button :type="menuText('primary')"
                   :icon="config.copyBtnIcon"
                   :size="crud.isMediumSize"
                   :disabled="crud.btnDisabledList[$index]"
                   @click.stop="crud.rowCopy(row)"
                   v-permission="crud.getPermission('copyBtn',row,$index)"
                   v-if="vaildData(crud.tableOption.copyBtn,config.copyBtn)">
          <template v-if="!isIconMenu">
            {{crud.menuIcon('copyBtn')}}
          </template>
        </el-button>
        </el-tooltip>
        <el-tooltip class="item" :disabled="vaildData(!isIconMenu,true)" effect="dark"
                    :content="crud.menuIcon('delBtn')"
                    placement="top">
        <el-button :type="menuText('danger')"
                   :icon="config.delBtnIcon"
                   :size="crud.isMediumSize"
                   :disabled="crud.btnDisabledList[$index]"
                   @click.stop="crud.rowDel(row,$index)"
                   v-permission="crud.getPermission('delBtn',row,$index)"
                   v-if="vaildData(crud.tableOption.delBtn,config.delBtn) && !row.$cellEdit">
          <template v-if="!isIconMenu">
            {{crud.menuIcon('delBtn')}}
          </template>
        </el-button>
        </el-tooltip>


        <template v-for="(menu,index) in vaildData(crud.tableOption.menus,[])">
          <el-tooltip class="item" :disabled="vaildData(menu[menu.prop+'Tip'],vaildData(menu.btnTextShow,false))" effect="dark" :content="vaildData(menu.btnText,'')"
                      placement="top">
            <el-button
                :key="index"
                v-if="buttonCheckShow(menu,row,$index)"
                v-permission="crud.getPermission(menu.prop,row,$index)"
                :type="vaildData(menu.type,'text')"
                :icon="menu.icon"
                :size="crud.isMediumSize"
                :disabled= "buttonCheckDisabled(menu.prop,row,$index)"
                :plain="vaildData(menu.plain,false)"
                :round = "vaildData(menu.round,false)"
                @click.stop="()=>{menu.click && menu.click(row,$index)}">
              {{vaildData(menu.btnTextShow,false) ? vaildData(menu.btnText,''):''}}
            </el-button>
          </el-tooltip>
        </template>

        <template v-if="vaildData(crud.tableOption.menuComponent)">
          <template v-for="(item,index) in vaildData(crud.tableOption.menuComponent.menus,[])">
            <component  :is="crud.tableOption.menuComponent.getComponent(item.component)"
                        v-if="vaildData(item.show,true)"
                        v-bind="item"
                        :row="row"
                        :index="$index"
                        v-on="item.event">
              {{item.text}}
            </component>
          </template>
        </template>

      </template>
      <slot name="menu"
            :row="row"
            :type="menuText('primary')"
            :disabled="crud.btnDisabled"
            :size="crud.isMediumSize"
            :index="$index"></slot>
    </template>
  </el-table-column>
</template>

<script>
import create from "../../core/utils/create";
import config from "./config.js";
import locale from "../../core/mixins/locale";
import permission from '../../core/directive/permission';
export default create({
  name: "crud",
  data () {
    return {
      config: config,
    }
  },
  mixins: [locale],
  inject: ["crud"],
  directives: {
    permission
  },
  computed: {
    menuType () {
      return this.crud.tableOption.menuType || this.$ACVU.menuType || 'button';
    },
    isIconMenu () {
      return this.menuType === "icon"
    },
    isTextMenu () {
      return this.menuType === "text"
    },
    isMenu () {
      return this.menuType === "menu"
    },
  },
  methods: {
    buttonCheckDisabled(menu,row,index){
      if (typeof menu.disabled === 'function' ){
        return menu.disabled(row,index)
      }else {
        return this.vaildData(menu.disabled,false)
      }
    },
    buttonCheckShow(menu,row,index){
      if (typeof menu.show === 'function' ){
        return menu.show(row,index)
      }else {
       return this.vaildData(menu.show,true)
      }
    },
    menuText (value) {
      return ['text','icon', 'menu'].includes(this.menuType) ? "text" : value;
    },
  }
})
</script>

<style scoped lang="less">
.el-button{
  /deep/ i{
    font-size: 16px;
  }
  /deep/.el-icon-delete{
    color: #FF3246;
  }
}
</style>
