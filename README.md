# topNavigation
## 顶部导航栏(滚动切换)
******
### 1.描述
###### h5页面导航

    导航栏初始位置存在于页面中,滑过导航栏后将导航栏置顶.

    导航项根据页面滚动的位置同步变动,点击导航项页面滚动至相应位置.
### 2.使用
###### html文件中导入js文件、css文件
    其中Jquery文件当前使用版本为3.4.0
    导航项的对应内容处需要加自定义属性:data-anchor="true"
    导航栏的class和id最好固定为以下示例,尤其是class
```
<div class="nav_bar" id="nav_bar">
    <div class="nav_bar_content">
        <a class="nav_bar_item linkActive">index-1</a>
        <a class="nav_bar_item">index-2</a>
        <a class="nav_bar_item">index-3</a>
        <a class="nav_bar_item">index-4</a>
        <a class="nav_bar_item">index-5</a>
        <a class="nav_bar_item">index-6</a>
    </div>
</div>
```
###### js文件使用
```
var nav = new navigation({
    container: "#container",    // 外层容器id
    nav_bar: "#nav_bar",    // 导航栏id
    "ele_width": 150    // 导航项宽度
});
```
###### navigation.css说明
    .nav_bar    /* 导航栏class */
    .nav_bar_content    /* 导航栏内层容器class */
    .nav_bar_item    /* 导航项class */
    .linkActive    /* 当前项class */
###### navigation.js说明
    .hidden_nav    // 给自定义属性data-anchor="true"所在元素加的class
    data-navIndex    // 给自定义属性data-anchor="true"所在元素以及导航项.nav_bar_item加的class
### 3.原理
    监听滚动事件,滚动过导航条所在位置时改变导航条position
    通过自定义属性data-navIndex记录页面内容的位置,滚动至该位置时导航栏通过查找相对应的自定义属性data-navIndex滚动至可视区域
    
    导航项绑定点击事件,再次获取页面内容位置, 通过自定义属性data-navIndex得到页面内容位置并滚动到相应位置
### 4.思考
    代码好多地方冗余,有机会再优化
    
    导航栏级对应位置的计算有些地方是靠尝试和猜测得到的需要梳理清楚
    
    节流防抖啥的还没了解,后续再作考虑
    
    总之 , 等 待 优 化!!!!
