/**
 * Created by Administrator on 2017/10/26.
 * 处理入口页面交互和用户登陆信息
 */
var Article = require('../models/article');
var Category = require('../models/category');
var count = 2;  //每页返回的文章数目
exports.index = function (req, res) {
    Category.fetch(function (err, categories) {
        Article
            .find()
            .populate('category', 'name')
            .sort({'meta.updateAt': -1})
            .exec(function (err, articles) {
                if (err) {
                    console.log(err);
                    articles = [];
                }
                res.render('article_list', {
                    title: '鲤.池',
                    categories: categories,
                    articles: articles
                });
            });
    });

};

exports.getALL = function (req, res) {
    console.log('count = ' + count);
    var search = 'all';
    var page = parseInt(req.query.p,10) || 0;
    console.log('page = ' + page);
    Category.fetch(function (err, categories) {
        Article
            .find()
            .populate('category', 'name')
            .sort({'meta.updateAt': -1})
            .exec(function (err, articles) {
                if (err) {
                    console.log(err);
                    articles = [];
                }
                var results = articles.slice(page*count,count+page*count);
                console.log('toltal page = ' +Math.ceil(articles.length/count) );
                res.render('article_list', {
                    title: '鲤.池',
                    categories: categories,
                    search:search,
                    articles: results,
                    totalPage:Math.ceil(articles.length/count),
                    currentPage:page+1
                });
            });
    });
};

exports.getPart = function (req, res) {
    var categoryId = req.query.id;
    var page = parseInt(req.query.p,10) || 0;
    console.log('id = ' + categoryId);
    Category
        .findOne({_id: categoryId})
        .populate({
            path: 'articles',
            populate: { path: 'category' }
        })
        .sort({'meta.updateAt': -1})
        .exec(function (err, category) {
            if (err) return res.redirect('/');
            console.log('category articles');
            console.log(category);
            var articles = category.articles;
            var results = articles.slice(page*count,count+page*count);
            console.log('toltal page = ' +Math.ceil(articles.length/count) );
            var search = category._id;
            Category.fetch(function (err,categories) {
                if(err) return res.redirect("/");
                return res.render('article_list', {
                    title: '鲤.池',
                    categories: categories,
                    search:search,
                    articles: results,
                    totalPage:Math.ceil(articles.length/count),
                    currentPage:page+1
                });
            });

        });
};

exports.detail = function (req,res) {
    var id = req.query.id;
    Article
        .findOne({_id:id})
        .populate('category','name')
        .exec(function (err,article) {
            if(err) return res.redirect('/article/all');
            return res.render('article_detail',{
                title:'鲤.池',
                article:article
            });
        });

};

exports.content = function (req,res) {
    var id = req.query.id;
    Article
        .findOne({_id:id})
        .populate('category','name')
        .exec(function (err,article) {
            if(err) return res.json({content:'文章获取失败'});
            return res.json({content:article.content});
        });

};



