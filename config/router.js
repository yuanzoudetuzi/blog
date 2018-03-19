/**
 * Created by Administrator on 2017/10/27.
 * 路由处理
 */
let Index = require('../app/controllers/index');
let Demo = require('../app/controllers/demo');
let User =  require('../app/controllers/user');
let Admin = require('../app/controllers/admin');
let Article = require('../app/controllers/article');
let Category = require('../app/controllers/category');
module.exports = function (app) {
//index
    app.get('/',Index.index);
    app.get('/weather',Index.weather);
    app.get('/article/all',Index.getALL);
    app.get('/article/category',Index.getPart);
    app.get('/article/detail',Index.detail);
    app.get('/article/content',Index.content);
    app.get('/article/like',Index.like);
//demo
    app.get("/demo/all",Demo.all);
    app.get("/demo/detail",Demo.detail);
//user
    app.get('/signin',User.showSignin);
    app.get('/signup',User.showSignup);
    app.post('/user/signin',User.signin);
    app.post('/user/signup',User.signup);

// admin
    app.get('/admin',User.signinRequire,User.adminRequire,Admin.index);
//     app.get('/admin',Admin.index);

//article
     app.get('/admin/article/list',Article.list);
     app.get('/admin/article/write',Article.write);
     app.post('/admin/article/new',Article.new);
     app.get('/admin/article/edit',Article.edit);          /*显示编辑页面*/
     app.get('/admin/article/detail/:id',Article.detail);  /*显示编辑页面文章内容*/
     app.post('/admin/article/update',Article.update);  /*更新文章内容*/
     app.delete('/admin/article/list',Article.del);

 // category
    app.get('/admin/category/write',Category.write);
    app.get('/admin/category/list',Category.list);
    app.post('/admin/category/new',Category.new);
    app.delete('/admin/category/list',Category.del);
};
