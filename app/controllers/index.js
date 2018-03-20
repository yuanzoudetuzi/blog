/**
 * Created by Administrator on 2017/10/26.
 * 处理入口页面交互和用户登陆信息
 */
let Article = require('../models/article');
let Category = require('../models/category');
let Weather = require('./weather');
const UID = "U6090EE1AD"; // 心知天气用户ID，请更换成您自己的用户ID
const KEY = "dzbdjfztpxc77zrq"; // 心知天气用户key，请更换成您自己的 Key
let weather = new Weather(UID, KEY);
let count = 2;  //每页返回的文章数目
let headNav = "blog";  /*导航高亮部分*/
exports.index = function (req, res) {
    res.render('index1', {
        title: '鲤.池'
    });
};

exports.weather = function (req,res) {
    let ip = req.query.ip; // 除拼音外，还可以使用 v3 id、汉语等形式
    console.log("ip = " + ip);
    weather.getCityNow(ip).then(function(data) {
        let LOCATION = data["results"][0].name;
        console.log("city = " + LOCATION);
        weather.getWeatherNow(LOCATION).then(function(data) {
            recData = data["results"][0];
            let {name:location} = recData.location;
            let {text:weather,temperature} = recData.now;
            console.log("location = " + location + " weather = " + weather + "  temperature = " + temperature);
            let sendData = {
                location:location,
                weather:weather,
                temperature:temperature
            };
            return res.json({"data":sendData});
        }).catch(function(err) {
            console.log(err.error.status);
            return res.json({"err":"get weather wrong"});

        });
    }).catch(function(err) {
        console.log(err.error.status);
        return res.json({"err":"get city wrong"});

    });

};

exports.getALL = function (req, res) {
    console.log('count = ' + count);
    let search = 'all';
    let page = parseInt(req.query.p,10) || 0;
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
                let results = articles.slice(page*count,count+page*count);
                console.log('toltal page = ' +Math.ceil(articles.length/count) );
                res.render('article_list', {
                    title: '鲤.池',
                    categories: categories,
                    search:search,
                    articles: results,
                    totalPage:Math.ceil(articles.length/count),
                    currentPage:page+1,
                    headNav:headNav
                });
            });
    });
};

exports.getPart = function (req, res) {
    let categoryId = req.query.id;
    let page = parseInt(req.query.p,10) || 0;
    console.log('categoryId id = ' + categoryId);
    Category
        .findOne({_id: categoryId})
        .populate({
            path: 'articles',
            populate: { path: 'category' }
        })
        .sort({'meta.updateAt': -1})
        .exec(function (err, category) {
            if (err) return res.redirect('/');
            // console.log('category articles');
            // console.log(category);
            let articles = category.articles;
            let results = articles.slice(page*count,count+page*count);
            console.log('toltal page = ' +Math.ceil(articles.length/count) );
            let search = category._id;
            // console.log('typeof category._id');
            // console.log(typeof category._id);
            Category.fetch(function (err,categories) {
                if(err) return res.redirect("/");
                return res.render('article_list', {
                    title: '鲤.池',
                    categories: categories,
                    search:search,
                    headNav:headNav,
                    articles: results,
                    totalPage:Math.ceil(articles.length/count),
                    currentPage:page+1
                });
            });

        });
};

exports.detail = function (req,res) {
    let id = req.query.id;
    Article
        .update({_id:id},{$inc:{watchNumber:1}},function (err) {
            if(err) console.log(err);

        });
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
    let id = req.query.id;
    Article
        .findOne({_id:id})
        .populate('category','name')
        .exec(function (err,article) {
            if(err) return res.json({content:'文章获取失败'});
            return res.json({content:article.content});
        });

};


exports.like =function (req,res) {
    let id = req.query.id;
    Article.update({_id:id},{$inc:{likeNumber:1}},function (err) {
        if(err) {
            console.log(err);
            return res.json({"status":0});
        }
        else {
            return res.json({"status":1});
        }
    });

};


