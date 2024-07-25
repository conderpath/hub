<template>
  <div :class="b()">
    <p :style="styles">{{text}}</p>
  </div>
</template>

<script>
import create from "../../core/utils/create";
import props from "../../core/mixins/props.js";
import event from "../../core/mixins/event.js";
export default create({
  name: 'title',
  mixins: [props(), event()],
  props: {
    styles: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted () {

  },
  methods: {

  }
})
</script>

