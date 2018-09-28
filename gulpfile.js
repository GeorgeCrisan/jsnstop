const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const uglifyjs = require('gulp-uglify');

let reload = browserSync.reload;
    
//declare the paths in paths object for DRY
let paths = {
              'src': ['./models/**/*.js','./routes/**/*.js','keystone.js','package.json','templates/**'],

              'style' : {
                     input: ['./public/styles/{*.sass,_*.sass}'],
                     inputPartials: ['./public/styles/site/{*.sass,_*.sass}'],
                     output: './public/styles/'
              }
}

//use this function for errors handling in sass task
function catchErr(e){
    console.log(e);
    this.emit('end');
}


const autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%','Firefox ESR']
};

gulp.task('browser-sync',['nodemon'],()=>{
     browserSync.init({
           proxy: 'localhost:3000',
           port: 8000,
           //tunel: true
     });
});

gulp.task('javascript',()=>{
     return gulp.src('public/js/main.js')
            .pipe(babel({
                presets: ["babel-preset-env"]
            }))
            .pipe(uglifyjs())
            .pipe(gulp.dest('public/js/distjs'))
            .pipe(browserSync.stream())
})

gulp.task('sass',()=>{
      gulp.src(paths.style.input)
          .pipe(plumber())
          .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}))
          .on('error',catchErr)
          .pipe(autoprefixer(autoprefixerOptions))
          .pipe(gulp.dest(paths.style.output))
          .pipe(browserSync.stream())
          //.pipe(browserSync.reload({
          //  stream: true}));
});


gulp.task('nodemon',(cb)=>{
      var started = false;

      return nodemon({
              script: 'keystone.js'
      }).on('start',()=>{
           if(!started){
               cb();
               started = true;
           }
      });
});

gulp.task('watch',()=>{
       gulp.watch([paths.style.input,paths.style.inputPartials],['sass']);
       gulp.watch('public/js/main.js',['javascript']);
       gulp.watch(paths.src, reload);
       
});

gulp.task('start',['browser-sync','watch']);