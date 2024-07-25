<template>
  <div v-if="display" :class="[b({'header':!isHeader,'arrow':!arrow})]">
    <slot name="tabs"></slot>
    <component :is="collapseName" v-model="activeName" :value="text" @change="handleChange">
      <component :is="collapseItemName" :name="1" :disabled="!arrow">
        <div v-if="$slots.header&&header" slot="title" :class="[b('header')]">
          <slot name="header"></slot>
        </div>
        <div v-else-if="(label || icon)&&header" slot="title" :class="[b('header')]">
          <i v-if="icon" :class="[icon,b('icon')]"></i>
          <h1 v-if="label" :class="b('title')">
            {{ label }}
          </h1>
        </div>
        <slot></slot>
      </component>
    </component>
  </div>
</template>

<script>
import create from "../../core/utils/create";
export default create({
  name: "group",
  data () {
    return {
      activeName: '',
    }
  },
  props: {
    arrow: {
      type: Boolean,
      default: true
    },
    collapse: {
      type: Boolean,
      default: true
    },
    header: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String
    },
    display: {
      type: Boolean,
      default: true
    },
    card: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    }
  },
  watch: {
    text (val) {
      this.activeName = [val]
    },
  },
  computed: {
    collapseName () {
      return `${this.$ACVU.ui.type}Collapse`
    },
    collapseItemName () {
      return `${this.$ACVU.ui.type}CollapseItem`
    },
    text () {
      return this.collapse ? 1 : 0
    },
    isHeader () {
      return this.$slots.header && this.header || ((this.label || this.icon) && this.header)
    }
  },
  created () {
    this.activeName = [this.text]
  },
  methods: {
    handleChange (activeNames) {
      this.$emit('change', activeNames)
    },
  }
});
</script>

