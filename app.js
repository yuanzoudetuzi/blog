/**
 * Created by Administrator on 2017/10/26.
 */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connectMultiparty = require('connect-multiparty'); /*处理multipart/formd-data类型的数据*/
var app = express();
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var dbUrl =  'mongodb://localhost/blog';
var port = process.env.PORT||8080;
app.locals.moment = require('moment');

app.set('views','./app/views');      /*设置视图文件路径*/
app.set('view engine','pug');        /*设置模板引擎*/
app.use(express.static(path.join(__dirname,'public')));/*设置静态资源文件路径*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
        secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
        resave: false,
        saveUninitialized: true,
        store: new mongoStore({
            /*指定session存储方式*/
            url: dbUrl,
            collection: 'sessions'
        })
    })
);
app.use(connectMultiparty());


/*链接数据库*/

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl,{useMongoClient:true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('连接数据库成功')
});

app.listen(port,function () {
    console.log('listen at : ' + port);
});

require('./config/router')(app);

