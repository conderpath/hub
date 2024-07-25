export default function() {
    return {
        props:{
            label: {
                type: String,
                default: ''
            },
            prop: {
                type: String,
                default: ''
            },
            modelValue: {
              type:[String, Number, Array]
            },
            dicData: {
                type: Array,
                default: ()=>{
                    return []
                }
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            clearable: {
                type: Boolean,
                default: false
            },
            event: {
                type: Object,
                default(){
                    return {}
                }
            },
            min: {
                type: Number,
            },
            max: {
                type: Number,
            },
            change: {
                type: Function,
            }
        }
    }
}