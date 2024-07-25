export const toLine = (string)=>{
    try {
        return string.replace(/([A-Z])/g, '-$1').toLowerCase()
    }catch (err) {
        console.log(err)
    }
}

export  const setItem = (key, val)=>{
    if(!key) {
        new Error('localStorage need key item')
    }
    try{
        localStorage.setItem(key, JSON.stringify(val))
    }catch (e){
        localStorage.setItem(key, '')
    }

}

export const getItem = key =>{
    try {
        return JSON.parse(localStorage.getItem(key)) || ''
    }catch (e) {
        return ''
    }
}

export  const clearItems = ()=>{
    localStorage.clear()
}