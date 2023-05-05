
/* 分类切换 */
// 选中所有分类标签
const filterItems = document.querySelectorAll('.filter-item')

// 为每个分类标签添加点击事件
filterItems.forEach(filterItem => {
  filterItem.addEventListener('click', function() {

    // 获取当前分类标签的值（“全部”或其他值）
    const filterValue = this.innerHTML

    // 获取所有文章容器和它们的分类标签
    const postBoxes = document.querySelectorAll('.post-box')

    // 遍历所有文章容器
    postBoxes.forEach(postBox => {

      // 获取当前文章容器的分类标签
      const postCategory = postBox.querySelector('.category')

      // 如果当前分类标签的值为“全部”，则显示所有文章容器
      // 否则，如果当前分类标签的值不等于当前分类标签的值，则隐藏该文章容器，否则显示该文章容器
      if (filterValue === '全部') {
        postBox.style.display = 'block'
      } else {
        if (postCategory.innerHTML !== filterValue) {
          postBox.style.display = 'none'
        } else {
          postBox.style.display = 'block'
        }
      }
    })

    // 移除所有分类标签的“active-filter”类，为当前分类标签添加“active-filter”类
    filterItems.forEach(item => {
      item.classList.remove('active-filter')
    })
    this.classList.add('active-filter')
  })
})


/* 时间格式化函数 */
const formatDate = (date, format) => {
  const Date = dayjs(date).format(format)
  return Date
}


let page = 0
/* 文章渲染 */
const articleRender = async() => {
  const postBox = document.querySelector('.post')
  const articles = await http.get('/api/articles', {params: { page }})
  const articleArr = articles.data.data.map( item => `
  <div class="post-box">
    <div class="post-img-box"><img src="${ baseURL + item.imageUrl }" alt="" class="post-img"></div>
    <h2 class="category">${ item.tag }</h2>
    <a href="./pages/post-page.html?aid=${ item._id }" class="post-title">
        ${ item.title }
    </a>
    <span class="post-date">${ formatDate(item.createdAt, 'YYYY-MM-DD') }</span>
    <div class="post-main">${ item.content }</div>
    <div class="profile">
        <img src="${ baseURL + item.author.headImgUrl }" alt="" class="profile-img">
        <span class="profile-name">${ item.author.username }</span>
    </div>
  </div>
  `)

  // postBox.innerHTML = ''
  postBox.innerHTML += articleArr.join('')
}

articleRender()

// 触底加载更多文章
window.addEventListener('scroll', () => {
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  const scrollTop = document.documentElement.scrollTop
  // console.log(scrollHeight,clientHeight, scrollTop)
  if(clientHeight + scrollTop >= scrollHeight) {
      page ++
      articleRender()
  }
})