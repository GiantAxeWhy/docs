# Headline

// docsify serve docs
https://giantaxewhy.github.io/docs/

      > An awesome project.
      > 在京东的半年工作中，负责四个项目的搭建，业务模块的实现联调等工作，主要技术栈使用的 vue。提交了两片专利，一篇已经过审，一篇审查中，分别是虚拟列表的不定高实现，与高性能深拷贝在项目中的应用。同时业余时间实现了自己的技术博客搭建采用 vue+express+mysql 的技术栈，同时前段时间自己实现了一个 min-vue,基本自主实现了一些核心基础功能.
      > 在虚拟滚动实现的过程中，封装了一个小组件
      > 1、计算当前可视区域的起始数据索引（startIndex）
      > 2、计算当前可视区域的末尾数据索引（endIndex）
      > 3、可视区域的数据，渲染到可视区域
      > 4、计算起始数据索引 在整个列表数据索引中的偏移位置（startOffset）并且设置到列表中 因此整个可视区域的渲染结构如下
      > 1）假定可视区域高度固定，称之为 screenHeight
      > 2）假定列表每项高度固定，称之为 itemSize
      > 3）假定列表数据称之为 listData
      > 4）假定当前滚动位置称之为 scrollTop
      > 由此可得出计算关系 1、列表总高度 listHeight = listData.length \* itemSize
      > 2、可显示的列表项数 visibleCount = Math.ceil(screenHeight / itemSize)
      > 3、数据的起始索引 startIndex = Math.floor(scrollTop / itemSize)
      > 4、数据的结束索引 endIndex = startIndex + visibleCount
      > 5、列表显示数据为 visibleData = listData.slice(startIndex,endIndex)
      > 当滚动后，由于渲染区域相对于可视区域已经发生了偏移，此时我需要获取一个偏移量 startOffset，通过样式控制将渲染区域偏移至可视区域中。 偏移量 startOffset = scrollTop - (scrollTop % itemSize);
      > 扩展 当需要渲染的 item 高度不固定时
