/* 编辑器配置 */
const E = window.wangEditor
    
const editorConfig = {
    placeholder: 'Type here...',
    MENU_CONF: {
    uploadImage: {
        fieldName: 'your-fileName',
        base64LimitSize: 10 * 1024 * 1024 // 10M 以下插入 base64
    }
    },
    // onChange(editor) {
    // console.log(editor.getHtml())
    // }
}

// 先创建 editor
const editor = E.createEditor({
    selector: '#editor-text-area',
    content: [],
    // html: '',
    config: editorConfig
})

// 创建 toolbar
const toolbar = E.createToolbar({
    editor,
    selector: '#editor-toolbar',
    config: {
    excludeKeys: ['fullScreen','insertVideo']
    },
    mode: 'simple'
})

// 点击空白处 focus 编辑器
document.getElementById('editor-text-area').addEventListener('click', e => {
    if (e.target.id === 'editor-text-area') {
    editor.blur()
    editor.focus(true) // focus 到末尾
    }
})

/* 时间格式化函数 */
const formatDate = (date, format) => {
    const Date = dayjs(date).format(format)
    return Date
}

// 分类选择
const allCategory = document.querySelectorAll('.category ul li')
allCategory.forEach( item => {
    item.addEventListener('click', function() {
        allCategory.forEach( i => {
            i.classList.remove('active')
        })
        this.classList.add('active')
    })
} )

/* 获取aid */
const aid = new URLSearchParams(location.search).get('aid')

const fileUpload = document.querySelector('#file-upload')
const previewImage = document.getElementById('preview-image')


/* 封面上传功能 */
const fd = new FormData()
fileUpload.addEventListener('change', function() {
    const file = this.files[0]
    fd.append('file', file)
    console.log(fd.get('file'))

    if(file) {
        previewImage.style.display = 'block'
        const reader = new FileReader()
        reader.addEventListener('load', function() {
            previewImage.setAttribute('src', this.result)
        })

        // 传入图片文件
        reader.readAsDataURL(file)
        console.log(reader)
    }
})


const titleE = document.querySelector('#title-container input')
let imageU

/* 填充编辑页面内容 */
const loadEditC = async() => {
    const r = await http.get('/api/articles/' + aid)
    console.log(r.data.data)
    const { imageUrl, tag, title, content, coms } = r.data.data

    imageU = imageUrl

    // 填充封面图片
    previewImage.style.display = 'block'
    previewImage.setAttribute('src', baseURL + imageUrl)

    // 填充分类
    allCategory.forEach( i => {
        if(i.innerHTML == tag) {
            allCategory.forEach( j => {
                j.classList.remove('active')
            })
            i.classList.add('active')
        }
    } )

    // 填充标题
    titleE.value = title

    // 填充内容
    editor.setHtml(content)

    // 填充评论列表
    loadComment(coms)
    
}

loadEditC()

const commentBox = document.querySelector('.comment-box')
const loadComment = (data) => {
    const commentArr = data.map( item => `
    <div class="comment-content">
        <img src="${ baseURL + item.reply_user_id.headImgUrl }" alt="" class="cm-img">
        <div class="content">
            <div class="cm-name">${ item.reply_user_id.username }</div>
            <p class="cm-content">${ item.content }</p>
            
            <div class="cm-del">
                <p class="cm-date">${ formatDate(item.createdAt, 'YYYY-MM-DD HH:mm') }</p>
                <button data-id="${ item._id }">删除</button>
            </div>
        </div>
    </div> 
    `)

    commentBox.innerHTML = ''
    commentBox.innerHTML += commentArr.join('')
}

// 删除评论-添加点击事件
commentBox.addEventListener('click', async (e) => {
    const cid = e.target.dataset.id
    // 删除评论
    const r1 = await http.delete('/api/comments/' + cid)

    layui.use('layer', function(){
        const layer = layui.layer
        layer.msg(r1.data.msg)
    })

    // 获取评论列表
    const r2 = await http.get('/api/comments/article/' + aid)
    const coms = r2.data.data

    loadComment(coms)
  })



/* 保存更新后的文章 */
const UpdateA = document.querySelector('.top button')
UpdateA.addEventListener('click', async() => {
    const tag = document.querySelector('.category ul .active').innerHTML
    const image = fd.get('file') || imageU
    const title = document.querySelector('#title-container input').value
    const content = editor.getHtml()
    if(!tag || !image || !title || !content ) {
        return layui.use('layer', function(){
            const layer = layui.layer;
            layer.msg('文章封面/分类/标题/内容不能为空');
        })
    }

    // 上传封面图片到后台
    let imageUrl = imageU
    if(image !== imageU){
        const upload = await http.post('/api/upload', fd)
        imageUrl = upload.data.data
    }
   
    // 提交修改后的文章信息
    const r = await http.patch('/api/articles/' + aid, {
        imageUrl,
        title,
        content,
        tag
    })

    layui.use('layer', function(){
        const layer = layui.layer;
        layer.msg(r.data.msg);
    })

    if(r.data.code) {
        setTimeout(() => {
            location.href = '../pages/article-list.html'
        }, 500)
    }
})







