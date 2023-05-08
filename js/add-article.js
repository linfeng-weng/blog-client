/*  */
// 图片上传
const fileUpload = document.querySelector('#file-upload')
const previewImage = document.getElementById('preview-image')

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

// 点击发布文章
const publishA = document.querySelector('.top button')
publishA.addEventListener('click', async function() {
    const tag = document.querySelector('.category ul .active').innerHTML
    const image = fd.get('file')
    const title = document.querySelector('#title-container input').value
    const content = editor.getHtml()
    if(!tag || !image || !title || !content ) {
        return layui.use('layer', function(){
            const layer = layui.layer;
            layer.msg('文章封面/分类/标题/内容不能为空');
        })
    }
    
    // 上传封面图片到后台
    const upload = await http.post('/api/upload', fd)
    const imageUrl = upload.data.data

    // 提交文章信息
    const r = await http.post('/api/articles', {
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
            location.href = '../index.html'
        }, 500)
    }
})

