const loginForm = document.querySelector('form')
const ipts = document.querySelectorAll('input')

loginForm.onsubmit = async (e) => {
    // 阻止表单默认提交行为
    e.preventDefault() 
    const username = ipts[0].value
    const password = ipts[1].value
    const loginAPI = '/api/users'

    const r = await http.get(loginAPI, {params: {username, password}})

    layui.use('layer', function(){
        const layer = layui.layer;
        layer.msg(r.data.msg);
      })

    // 成功登录
    if(r.data.code) {
        // 将用户信息传入localStorage
        const user = {
            username: r.data.username,
            uid: r.data.uid,
            headImgUrl: r.data.headImgUrl,
            token: r.data.token
        }
        localStorage.setItem('user', JSON.stringify(user))
        
        // 登录成功跳转主页
        setTimeout(() => {
            location.href = '../index.html'
        }, 1000)
        
    }
}