const ipts = document.querySelectorAll('input')
const regForm = document.querySelector('form')

// 头像上传
const fd = new FormData()
ipts[2].onchange = function() {
    // 获取上传的文件
    const file = this.files[0]
     // 向FormData对象中添加文件
    fd.append('file', file)
}

// 点击注册按钮事件
regForm.onsubmit = async (e) => {
    // 阻止表单的默认提交行为
    e.preventDefault()

    // 头像上传
    const upload = await http.post('/api/upload', fd)
    const headImgUrl = upload.data.data

    const username = ipts[0].value
    const password = ipts[1].value
    
    // 提交注册信息
    const r = await http.post('/api/users', {
        username,
        password,
        headImgUrl
    })

    layui.use('layer', function(){
        const layer = layui.layer;
        layer.msg(r.data.msg);
      })

    if(r.data.code) {
        for(let i = 0; i < 3; i++) {
            ipts[i].value = ''
        }
        setTimeout(() => {
            location.href = 'login.html'
        }, 500)
    }

}