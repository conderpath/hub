export default {
  options: {
    type: Object,
    required: true,
    default() {
      return {
        columns: []
      }
    }
  },
  data: {
    type: Array,
    required: true,
    default() {
      return []
    }

  },
  searchData: {
    type: Object,
    default() {
      return {}
    }
  },
  permission: {
    type: Function,
    default() {
      return null
    }
  }
}