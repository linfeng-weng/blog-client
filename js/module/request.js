/* 网络请求配置 */
const baseURL = 'http://127.0.0.1:3000'

// 创建一个基于Axios的HTTP实例
const http = axios.create({
    // 指定基础URL
    baseURL
})

// 添加请求拦截器，在发送请求前自动添加认证信息
http.interceptors.request.use(
    function(config) {
        // 从localStorage中获取用户信息
        const User = JSON.parse(localStorage.getItem('user'))
        // 如果用户信息存在
        if(User) {
            // 获取用户的token
            const token = User.token
             // 在请求头中添加认证信息
            config.headers['Authorization'] = 'Bearer ' + token
        }
        // 返回修改后的请求配置
        return config
    },
     // 如果请求出现错误，直接reject
    function(error) {
        return Promise.reject(error)
    }
)