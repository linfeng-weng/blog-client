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