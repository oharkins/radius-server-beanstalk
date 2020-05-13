const params = new URLSearchParams(window.location.search)
for (const param of params) {
    window.sessionStorage.setItem(param[0], param[1])
    console.log(param)    
}
