
# gulp空白项目
### 如何使用
------------
#### 前置条件
必须得先安装以下软件：
    nodejs，gulp，bower，browser-sync
    
    初次使用执行
    npm install
    bower install
    
#### 使用命令

    gulp s = gulp server = gulp  
    gulp s -p 9000 //可以修改http的端口号 默认9000
    
    //任务server的前置任务 (.dev)
    'html', //替换html模板
    'svgs', //svg 按目录生成svg symbol
    'jshint', //JS校检
    'wiredep' //同步bower信息
    然后创建http服务，并建立watch
    

    gulp b = gulp build
    
    //任务build的前置任务 (.build)
    'b_svgs', //svg 按目录生成svg symbol
    'b_html', //替换html模板
    'b_copy_img_font_data' //复制图片、字体和模拟数据
    
    
    gulp bs = gulp b_server
    gulp bs -p 9000 //可以修改http的端口号 默认9000
    
    //任务b_server的前置任务 (.build)
    'build'
    
    
    gulp p = gulp publish
    
    //任务publish的前置任务 (dist)
    'build',
    'p_copy_html' //复制html到dist
    'uglify_js' //压缩js 并添加hash
    'uglify_css' //压缩css 并添加hash
    'p_copy_img' //复制图片 并添加hash
    'p_replace' //替换文件中的资源的hash
    'config_read' //读取各部分的配置文件
    'config_write' //生成配置文件
    
    gulp zip -d app -n app //打包“app”目录，压缩包文件名为“app”
    gulp zip //默认打包dist目录
    
    gulp test //test
    

### setting.json配置文件说明
---------------------------
    {
    "fileinclude": { //替换模板参数
        "prefix": "<!--@@ ",
        "suffix": " -->",
        "basepath": "@file",
        "context": { //模板全局变量
            "sitename": "estorm.cn",
            "separator": " - "
        }
    },
    "staticHosts": "/"
    }

### 目录说明
---------------------------
    app: 开发根目录
    |--config 页面配置
    |----route.json //ajax接口路由
    
    |--data ajax接口模拟数据
    
    |--modules 模块目录
    |----calculator（模块）//功能模块
    |------images 图片资源 gif,png,jpg,jpeg,svg （不支持子目录）
    |------index.css //css1
    |------index1.css //css2
    |------index.html //模板1
    |------index2.html //模板2
    |------index.js
    
    |--demo 示例页面
    
    |--pages 页面目录 （不支持二级目录）
    
    |--static 静态资源 css, js, image, data
    |----images 图片资源
    |----styles css文件
    |----scripts js文件
    |------lib.js 方法库
    |------init.js 公共初始化
    |----svgs svg文件
    |----fonts 字体文件
    
    |--plugins 插件目录 //插件，外部插件
    
    test: 测试目录（用例）
    |--math.js （模块文件）
    |--math.test.js （模块测试用例）


### 项目中所使用的插件
---------------------------

    "gulp": "^3.9.1",
    "browser-sync": "^2.18.8", //http服务以及自动刷新功能
    "chai": "^3.5.0", //断言
    "gulp-mocha": "^4.0.1", //测试
    "gulp-load-plugins": "^1.5.0", //自动载入gulp插件，不用var require 以$.的方式使用
    "minimist": "^1.2.0", //获取命令行参数
    "gulp-file-include": "^1.0.0", //替换html代码片段
    "gulp-changed": "^2.0.0", //只编译改动过的文件
    "gulp-svg-symbols": "^2.0.2", //处理svg图像
    "merge-stream": "^1.0.1", //合并
    "map-stream": "0.0.6", //遍历
    "fs": "0.0.1-security", 
    "path": "^0.12.7", 
    "gulp-jshint": "^2.0.4",
    "jshint": "^2.9.4",
    "jshint-stylish": "^2.2.1",
    "gulp-useref": "^3.1.2", //读取页面上的css js配置 并打包
    "gulp-clean-css": "^3.0.3", //压缩css
    "gulp-uglify": "^2.0.1", //压缩js
    "gulp-rename": "^1.2.2", //重命名
    "gulp-hash": "^4.0.1", //hash
    "gulp-zip": "^4.0.0", //导出压缩包
    "wiredep": "^4.0.0", //bower数据同步
    "lazypipe": "^1.0.1",
    "gulp-sourcemaps": "^2.4.1",
    


### 使用方法
----------

##### 新建页面
 1. 直接在pages直接新建一个空白页，改成想要的名字（如：index.html），分割建议“_”，不建议使用“-”。default.html为保留文件，是站点默认索引页； 
 2. 如果要使用公共文件（例如全站js文件：vendor.js，全站css文件：vendor.css，插入）；
 
    &lt;!--@@ include("../modules/bower/vendor.css.html") --&gt;<br>
    &lt;!--@@ include("../modules/bower/vendor.js.html") --&gt;
 
 3. 如果要在页面使用模块（modules），需要在配置文件中添加对应的css和js；【modules是最小单位，不建议再做拆分】；
 
    &lt;!--@@ include("../modules/模板目录/index.html") --&gt;
 
 4. 在 modules/scripts 和 modules/styles 下新建一个与页面同名的文件；
    
    &lt;!-- build:js /static/scripts/index.js --&gt;<br>
    &lt;script src="/app/static/scripts/index.js"&gt;&lt;/script&gt;<br>
    &lt;!-- endbuild --&gt;
    
    &lt;!-- build:css /static/styles/index.css --&gt;<br>
    &lt;link type="text/css" rel="stylesheet" href="/app/static/styles/index.css"&gt;<br>
    &lt;!-- endbuild --&gt;
 
 5. 新建页面(pages/index.html)对应的位置插入；
    
    &lt;!--@@ include("../modules/styles/index.html") --&gt;<br>
    &lt;!--@@ include("../modules/scripts/index.html") --&gt;
 
 6. js/css文件中的图片路径写成“/app/....”；
 7. 载入svg 需要在js文件中加入 
 
    nosh.loadSvg('svg路径'); //方法在lib.js下
    
    //在html中使用
    &lt;!--@@ include("../modules/svg/index.html", {"file": "svg icon文件名"}) --&gt;
    
    //在js中使用
    nosh.svg('svg icon文件名'); //方法在lib.js下
    
 
##### 新建模块
 1. css代码片段(.css) js代码(.js) html代码片段(.html) 说明文档(.md)；
 2. js和md建议唯一；
 3. 所有文件并不必须； 
 4. 图片文件仅支持 gif,png,jpg,jpeg,svg。

    
##### 测试用例
查看test目录下 math.test.js letter.test.js


### 初始包含框架/插件
---------------

1. jQuery 3.1.1
2. font-awesome
3. vuejs
