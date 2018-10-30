
var gulp = require('gulp')
var sass = require('gulp-sass')//sass编译
var browserSync = require('browser-sync');//自动刷新
var config = require('./config.js');
var fileinclude  = require('gulp-file-include');
// var plumber = require('gulp-plumber');
// var replace = require('gulp-replace');
//var fileinclude  = require('gulp-file-include');  //公用头尾引用插件

// function jsSet(cfg) {
//   return gulp.src(cfg.jsSrc)
//     .pipe(uglify())
//     .pipe(gulp.dest(cfg.distJs));
// }

//头部
gulp.task('fileinclude', function() {
    // 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
    gulp.src(['static/web/limitManage/html-www/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('static/web/limitManage/html-gulp-www'));
});
function cssSet(cfg) {
	console.log(cfg.sassSrc)
  return gulp.src(cfg.sassSrc)//return 防止异步
  	  //.pipe(plumber()) 
	  .pipe(sass({outputStyle: 'compact'}))
	  .pipe(gulp.dest(cfg.cssSrc))
	  //.pipe(rename({ suffix: '.min' }))
	  //.pipe(minifycss())
	  //.pipe(gulp.dest(cfg.distCss));
}



function watch(cfg){
	gulp.watch(cfg.sassSrc,function(event){
		cssSet(cfg);
	})//.on('change', browserSync.reload);
    gulp.watch(cfg.htmlIncAfter,function(event){
        include(cfg);
    })
    //gulp.watch(cfg.htmlSrc, browserSync.reload);
    //gulp.watch(cfg.jsSrc, browserSync.reload);
}

//
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'project'
    },
  })
})

//默认任务，循环遍历模块
gulp.task('dry',function() {
	for(var name in config){
		cssSet(config[name])
	    watch(config[name]);//监听
        include(config[name])
	 }

});
function include(include){
    if(!include.htmlIncAfter){
        return;
    }
    console.log(include.htmlIncAfter)
    gulp.src([include.htmlIncAfter])//gulp前的文件路径
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(include.htmlIncBefore));//gulp后的路径

}


//替换任务
// var arr = [];
// var devUrl = 'www.baidu.com';
// var betaUrl = 'www.ttt.com';
// gulp.task('replace',function(){
// 	for(var name in config){
// 		arr.push(config[name]['htmlSrc1']);
// 	}
//      arr.forEach(function(val,i){
// 		var length = val.indexOf('*.html');
// 		var destSrc = val.substr(0,length);
//      	gulp.src(val)
// 	       .pipe(replace(devUrl,betaUrl))   //替换地址
// 	       .pipe(gulp.dest(destSrc))
//      })
// });





