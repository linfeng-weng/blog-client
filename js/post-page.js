
/* 时间格式化函数 */
const formatDate = (date, format) => {
    const Date = dayjs(date).format(format)
    return Date
}

// 获取aid
const aid = new URLSearchParams(location.search).get('aid')

/* 文章渲染 */
const loadArticle = async() => {
    const title = document.querySelector('.post-header .header-title')
    const img = document.querySelector('.post-header .header-img')
    const content = document.querySelector('.post-content')

    const r = await http.get('/api/articles/' + aid)
    const articleInfo = r.data.data

    title.innerHTML = articleInfo.title
    img.setAttribute('src', baseURL + articleInfo.imageUrl)
    content.innerHTML = articleInfo.content

}

loadArticle()


/* 评论列表渲染 */
const loadComment = async() => {
    const cmBox = document.querySelector('.comment-box')
    const r = await http.get('/api/comments/article/' + aid)
    console.log(r)
    const commentArr = r.data.data.map( item => `
    <div class="comment-content">
        <img src="${ baseURL + item.reply_user_id.headImgUrl }" alt="" class="cm-img">
        <div class="content">
            <div class="cm-name">${ item.reply_user_id.username }</div>
            <p class="cm-content">${ item.content }</p>
            <p class="cm-date">${ formatDate(item.createdAt, 'YYYY-MM-DD HH:mm') }</p>
        </div>
    </div>
    ` )
    cmBox.innerHTML = ''
    cmBox.innerHTML += commentArr.join('')
}

loadComment()


/* 评论 */
const comment = document.querySelector('textarea')
const commentBtn = document.querySelector('.cm-send') 
const userInfo = JSON.parse(localStorage.getItem('user'))

if(userInfo) {
    const headImgUrl = userInfo.headImgUrl
    const userImg = document.querySelector('.comment-header .comment-profile')
    userImg.setAttribute('src', baseURL + headImgUrl)
    commentBtn.addEventListener('click', async() => {
        const commentA = comment.value.trim()
        if (!commentA) {
            comment.value = ''
            layui.use('layer', function(){
                const layer = layui.layer
                layer.msg('评论不能为空')
            })
        }
        const r = await http.post('/api/comments', {
            content: commentA,
            article_id: aid
        })

        layui.use('layer', function(){
            const layer = layui.layer
            layer.msg(r.data.msg)
        })

        comment.value = ''
        loadComment()

    })
    // 发布评论
    
    commentBtn.addEventListener('click', () => {})
}else {
    comment.setAttribute('placeholder', '登录即可评论')
    comment.setAttribute('disabled', 'true')
}
