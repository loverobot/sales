var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2)); //获取命令行参数 gulp mocha -x 1 -y 2 = { _: [ 'mocha' ], x: 1, y: 2 }
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var merge = require('merge-stream');
var map = require('map-stream');
var fs = require('fs');
var path = require('path');
var wiredep = require('wiredep').stream;
var lazypipe = require('lazypipe');
var $ = require('gulp-load-plugins')(); //载入package.json下所有的gulp插件
var routes = require('./app/config/route.json'); //ajax接口路由
var setting = require('./setting.json'); //全局配置文件
var task = argv._[0] ? argv._[0] : 'server';
var port = argv.p ? argv.p : 9000;
var devFile = '.dev';
var buildFile = '.build';

var useref = require('useref');

//处理html
var watchHtmlFile = ['app/pages/**/*.html', 'app/demo/**/*.html'];
gulp.task('html', ['wiredep'], function(){
    return gulp.src(watchHtmlFile, { base: 'app' })
        .pipe($.changed(devFile, {
            extension: '.html',
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe($.fileInclude(setting.fileinclude))
        .pipe(gulp.dest(devFile))
        .pipe(reload({ stream: true }));
});

//处理svg
var getFolders = function(dir){
    var res = [];
    if(fs.existsSync(dir)){
        res = fs.readdirSync(dir)
            .filter(function(file){
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
    }
    return res;
};
var svgTask = function(opt){
    var fileFolder = '';
    var targetFolder = '';
    var folders = null;
    var tasks = null;

    opt = opt ? opt : {
        fileFolder: 'app/static/svgs',
        targetFolder: devFile +'/static/svgs',
        id: 'svgicon',
        name: 'svg_static_svgs'
    };

    fileFolder = opt.fileFolder;
    targetFolder = opt.targetFolder;
    folders = getFolders(fileFolder);
    tasks = folders.map(function(folder) {
        var src = [path.join(fileFolder, folder, '/**/*.svg')];
        var dist = path.join(targetFolder);
        return gulp.src(src)
            .pipe($.changed(dist, {
                extension: '.svg',
                hasChanged: $.changed.compareSha1Digest
            }))
            .pipe($.svgSymbols({
                id: opt.id +'-%f',
                templates: ['default-svg']
            }))
            .pipe(map(function(file, cb){
                file.path = opt.name +'_'+ folder +'.svg';
                cb(null, file);
            }))
            .pipe(gulp.dest(dist))
            .pipe(reload({ stream: true }));
    });

    if(tasks.length > 0){
       return merge(tasks);
    }
};

gulp.task('svgModules', function(){
    svgTask({
        fileFolder: 'app/modules',
        targetFolder: devFile +'/static/svgs/modules',
        id: 'svgicon-modules',
        name: 'svg_modules'
    });
});

gulp.task('svgStatic', function(){
    svgTask();
});

//bower资源管理
gulp.task('wiredep', function(){
    return gulp.src('app/modules/bower/*.html')
        .pipe(wiredep({
            exclude: [],
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app/modules/bower/'));
});

gulp.task('svgs', ['svgModules', 'svgStatic']);

//js校检
var jshintFile = null;
var getJshintFile = function(){
    var res = ['app/static/scripts/**/**.js', 'app/modules/**/**.js'];
    return jshintFile ? jshintFile : res;
};
gulp.task('jshint', function(){
    var jsFile = getJshintFile();
    return gulp.src(jsFile)
        .pipe($.jshint()) 
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(reload({ stream: true }));
});
var scssFile = null;
var changeScssFile = function(){
    var file = ['app/sass/**/**.scss'];
	return scssFile ? scssFile : file;
}
//sass 编译
gulp.task('sass',function(){
   var file = changeScssFile();
   return gulp.src(file)
	   .pipe($.sass().on('error',$.sass.logError))
	   .pipe(gulp.dest('app/css/'))
	   .pipe(reload({ stream:true }));
});
//http服务
gulp.task('server', ['html', 'svgs', 'jshint'], function(){
    browserSync.init({
        "port": port,
        "notify": false,
        "scrollProportionally": false,
        "server": {
            "baseDir": [devFile, devFile +'/pages', devFile +'/demo', 'app'],
            "index": "index.html",
            "routes": routes
        }
    });

    //监听文件变化

    //1.html文件变化
    gulp.watch('app/modules/**/*.html', function(event){
        watchHtmlFile = 'app/pages/**/*.html';
        gulp.start('html');
    });

    gulp.watch('app/pages/**/*.html', function(event){
        watchHtmlFile = event.path;
        gulp.start('html');
    });

    gulp.watch('app/demo/**/*.html', function(event){
        watchHtmlFile = event.path;
        gulp.start('html');
    });

    //2.modules svg文件变化
    gulp.watch('app/modules/**/**.svg', ['svgModules']);

    //3.static svg文件变化
    gulp.watch('app/static/svgs/**/**.svg', ['svgStatic']);

    //4.js文件的处理
    gulp.watch('app/**/**.js', function(event){
        jshintFile = event.path;
        gulp.start('jshint');
    });
    
	gulp.watch('app/**/**.scss',function(event){
	   scssFile = event.path;
	   gulp.start('sass');
	});
    //5.其他资源处理
    gulp.watch(['app/**/**.{jpg,jpeg,png,gif,json,css}'], reload);
});
gulp.task('s', ['server']); //开发项目

//--------------------------打包-----------------------------------

gulp.task('b_copy', ['wiredep'], function(){
    return gulp.src(['app/pages/**/*.html', 'app/static/assets.json', 'app/static/config.json', 'app/static/favicon.ico'], { base: 'app' })
        .pipe(gulp.dest(buildFile))
});

//资源整合<!-- build:js scripts/combined.js -->
gulp.task('b_useref', function(){
    return gulp.src(['app/modules/**/*.html', 'app/pages/**/*.html'], { base: 'app' })
        .pipe($.changed(buildFile, {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe($.useref({searchPath: './'}, lazypipe().pipe($.sourcemaps.init, { loadMaps: true })))
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest(buildFile));
});

gulp.task('b_html', ['b_copy', 'b_useref'], function(){
    return gulp.src(buildFile +'/pages/**/*.html', { base: buildFile })
        .pipe($.fileInclude(setting.fileinclude))
        .pipe(gulp.dest(buildFile));
});

gulp.task('b_svg_modules', function(){
    svgTask({
        fileFolder: 'app/modules',
        targetFolder: buildFile +'/static/svgs/modules',
        id: 'svgicon-modules',
        name: 'svg_modules'
    });
});

gulp.task('b_svg_static', function(){
    svgTask({
        fileFolder: 'app/static/svgs',
        targetFolder: buildFile +'/static/svgs',
        id: 'svgicon',
        name: 'svg_static_svgs'
    });
});

gulp.task('b_svgs', ['b_svg_modules', 'b_svg_static']);

gulp.task('b_copy_img_font_data', function(){
    return gulp.src([
        'app/data/**/*.*',
        'app/static/fonts/*.{otf,svg,eot,ttf,woff,woff2}',
        'app/static/images/**/*.{gif,png,jpg,jpeg}'
        ], { base: 'app' })
        .pipe(gulp.dest(buildFile))
});

gulp.task('build', ['b_svgs', 'b_html', 'b_copy_img_font_data']);
gulp.task('b', ['build']);

//---------------------------------------------------------------------

gulp.task('b_server', ['build'], function(){
    browserSync.init({
        port: port,
        notify: false,
        scrollProportionally: false,
        server: {
            baseDir: [buildFile, buildFile +'/pages'],
            index: 'default.html',
            routes: routes
        }
    });
});
gulp.task('bs', ['b_server']);

//--------------------------压缩上线-----------------------------------

//生成配置文件 config.json
var zeroFill = function(num){
    return parseInt(num) < 10 ? '0'+ num : num.toString();
};
var formatDate = function(timestamp){
    var tt = timestamp ? parseInt(timestamp) : new Date().getTime();
    var date = new Date(tt);
    var year = date.getFullYear();
    var mon = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var res = zeroFill(year) +'/'+ zeroFill(mon) +'/'+ zeroFill(day) +' '+ zeroFill(hour) +':'+ zeroFill(min) +':'+ zeroFill(sec);
    return res;
};
var configData = {
    hosts: setting.staticHosts,
    debug: ['http://localhost:9000/'],
    js: {},
    css: {},
    update: formatDate()
};

gulp.task('config_read', ['p_replace'], function(){
    var replacePre = function(text){
        text = text.replace(/^(\.\.\/)+/g, '');
        return text;
    };
    return gulp.src([buildFile +'/maps/**/*.map', 'dist/static/assets.json'])
        .pipe(map(function(file, cb){
            var contents = JSON.parse(String(file.contents));
            var filePath = path.parse(file.path);
            var name = filePath.name.split('.');
            var fileDir = '';
            var newName = name[1] ? name.join('.') : name[0] + filePath.ext;
            var key = '';
            var keyMin = '';
            var sources = [];
            if(filePath.name === 'assets' && filePath.ext === '.json'){
                for(var v in contents){
                    var val = contents[v];
                    var vF = v.split('.min.');
                    if(vF.length === 2){
                        configData[vF[1]][vF.join('.')].version = val.split('.')[2];
                    }
                }
                cb(null, file);
                return false;
            }
            for(var item in contents.sources){
                sources.push(replacePre(contents.sources[item]));
            };

            if(name[1] === 'js'){
                fileDir = 'scripts';
            } else if(name[1] === 'css'){
                fileDir = 'styles';
            }
            key = 'static/'+ fileDir +'/' + newName;
            keyMin = 'static/'+ fileDir + '/'+ name.join('.min.');

            if(name[1] === 'js'){
                configData.js[key] = {
                    ori: key,
                    min: keyMin,
                    concat: sources,
                    version: ''
                };
            } else if(name[1] === 'css'){
                configData.css[key] = {
                    ori: key,
                    min: keyMin,
                    concat: sources,
                    version: ''
                };
            }

            cb(null, file);
        }));
});

gulp.task('config_write', ['config_read'], function(){
    return gulp.src('dist/static/config.json', { base: 'dist' })
        .pipe(map(function(file, cb){
            console.log(file.path);
            var contents = JSON.stringify(configData, null, 4);
            file.contents = new Buffer(contents);
            cb(null, file);
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify_js', ['p_copy_html'], function(){
    return gulp.src(buildFile +'/static/scripts/**/*.js', { base: buildFile })
        .pipe(gulp.dest('dist'))
        .pipe($.rename(function(file){
            file.basename = file.basename + '.min';
        }))
        .pipe($.uglify())
        .pipe(gulp.dest('dist'))
        .pipe($.hash({
            hashLength: 8,
            template: '<%= name %>.<%= hash %><%= ext %>'
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.hash.manifest('static/assets.json'))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify_css', ['uglify_js'], function(){
    return gulp.src(buildFile +'/static/styles/**/*.css', { base: buildFile })
        .pipe(gulp.dest('dist'))
        .pipe($.rename(function(file){
            file.basename = file.basename + '.min';
        }))
        .pipe($.cleanCss())
        .pipe(gulp.dest('dist'))
        .pipe($.hash({
            hashLength: 8,
            template: '<%= name %>.<%= hash %><%= ext %>'
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.hash.manifest('static/assets.json'))
        .pipe(gulp.dest('dist'));
});

gulp.task('p_copy_html', function(){
    return gulp.src([
            buildFile +'/pages/**/*.html',
            buildFile +'/static/assets.json',
            buildFile +'/static/config.json',
            buildFile +'/static/favicon.ico'
        ], { base: buildFile })
        .pipe(gulp.dest('dist'));
});

gulp.task('p_copy_img', ['uglify_css'], function(){
    return gulp.src([
            buildFile +'/static/fonts/**/*.*',
            buildFile +'/static/images/**/*.*',
            buildFile +'/static/svgs/**/*.*'
        ], { base: buildFile })
        .pipe(gulp.dest('dist'))
        .pipe($.hash({
            hashLength: 8,
            template: '<%= name %>.<%= hash %><%= ext %>'
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.hash.manifest('static/assets.json'))
        .pipe(gulp.dest('dist'));
});

gulp.task('p_replace', ['p_copy_img'], function(){
    var assets = require('./dist/static/assets.json'); //要替换的文件路径
    var findContent = function(text){
        for(var key in assets){
            var val = assets[key];
            var oriPath = key.replace('.min', '');
            text = text.replace(new RegExp('/?'+ oriPath, 'gmi'), setting.staticHosts + val);
        }
        return text;
    };
    return gulp.src('dist/**/*.{html,js,css}', { base: 'dist' })
        .pipe(map(function(file, cb){
            var contents = String(file.contents);
            var newContent = findContent(contents);
            file.contents = new Buffer(newContent);
            cb(null, file);
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('publish', ['build'], function(){
    gulp.start('config_write');
});
gulp.task('p', ['publish']);

var zipDir = argv.d ? argv.d : 'dist';
var zipName = argv.n ? argv.n : 'dist';
gulp.task('zip', function(){
    gulp.src(zipDir +'/**/*.*')
        .pipe($.zip(zipName +'.zip'))
        .pipe(gulp.dest('./'))
});

gulp.task('test', function(){
    return gulp.src('test/*.test.js')
        .pipe($.mocha({
            reporter: 'spec'
        }));
});

gulp.task('default', [task]);
