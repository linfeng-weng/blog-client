/* 时间格式化函数 */
const formatDate = (date, format) => {
    const Date = dayjs(date).format(format)
    return Date
}

const userInfo = JSON.parse(localStorage.getItem('user'))
/* 用户信息 */
const userImg = document.querySelector('.user-container .user img')
const uname = document.querySelector('.user-container .user p')
if(userInfo) {
    userImg.setAttribute('src', baseURL + userInfo.headImgUrl)
    uname.innerHTML = userInfo.username
}

const listBox = document.querySelector('.list-box')
const loadArticleList = async() => {
    const uid = userInfo.uid
    const r = await http.get('/api/articles/users/' + uid)
    const articleListArr = r.data.data.map( item => `
    <div class="article">
        <div class="left"><img src="${ baseURL + item.imageUrl }" alt=""></div>
        <div class="right">
            <div class="top">
                <a href="../pages/post-page.html?aid=${ item._id }" class="title">${ item.title }</a>
                <h2 class="category">${ item.tag }</h2>
            </div>
            <div class="middle">
                <p class="content">${ item.content }</p>
            </div>
            <div class="bottom">
                <div class="date">${ formatDate(item.createdAt, 'YYYY-MM-DD') }</div>
                <div class="views"><span class="iconfont icon-view"></span>${ item.views }</div>
                <div class="cm"><span class="iconfont icon-comment_light"></span>${ item.coms.length }</div>
                <div class="edit"><a href="./edit-article.html?aid=${ item._id }">编辑</a></div>
                <div class="del" data-id="${ item._id }"><a href="javascript:;">删除</a></div>
            </div>
        </div>
    </div>
    `)

    
    listBox.innerHTML = ''
    listBox.innerHTML += articleListArr.join('')

}

loadArticleList()


// 删除操作
listBox.addEventListener('click', async (e) => {
  const target = e.target.closest('.del')
  if (target.classList.contains('del')) {
    const aid = target.dataset.id
    const r = await http.delete('/api/articles/' + aid)
    layui.use('layer', function(){
        const layer = layui.layer
        layer.msg(r.data.msg)
    })

    loadArticleList()
  }
})
