/**
 * Created by Administrator on 2017/10/26.
 * 处理入口页面交互和用户登陆信息
 */
var Article = require('../models/article');
exports.index = function (req,res) {
    Article.fetch(function (err,articles) {
        if(err) {
            console.log(err);
            articles=[];
        }
        res.render('index',{
            title:'鲤.池',
            articles:articles
        });
    });

};
/*
var express = require('express');
var router = express.Router();
// 该路由使用的中间件
/!*router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});*!/
router.get('/',function (req,res) {
    res.render('index',{
        title:'鲤.池'
    });
});
router.get('/showsignin',function (req,res) {
    res.render('index',{
        title:'鲤.池'
    });
});
module.exports = router;*/
