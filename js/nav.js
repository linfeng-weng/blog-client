/* 导航栏滚动背景设置 */
const header = document.querySelector('header')

window.addEventListener('scroll', () => {
    header.classList.toggle("shadow", window.scrollY > 0)
})


/*  */
const user = JSON.parse(localStorage.getItem('user'))

const userAvatar = document.querySelector('.nav #user img')
const login = document.querySelector('.nav .login')
const logout = document.querySelector('.nav #user .logout')
const userBox = document.querySelector('.nav #user')

// 如果用户信息存在，则将登录按钮替换为登录的用户头像
if(user) {
    userAvatar.src = baseURL + user.headImgUrl   
    login.style.display = 'none'
    userBox.style.display = 'block'
}

// 用户点击退出登录
logout.onclick = () => {
    // 清除user信息
    localStorage.removeItem('user')
    login.style.display = 'block'
    userBox.style.display = 'none'

    layui.use('layer', function(){
        const layer = layui.layer;
        layer.msg('成功退出');
      })    

    // 刷新当前页面
    location.reload()
    location.href = '../index.html'
}