/**
 * Created by Administrator on 2017/10/31.
 */
var Article = require('../models/article');
exports.list = function (req,res) {
    Article.fetch(function (err,articles) {
        if(err) {
            console.log(err);
            return  res.redirect('/admin');
        }
        res.render('admin_article',{
            title:'管理界面',
            isWrite:false,
            isList:true,
            articles:articles
        });
    });

};

exports.write = function (req,res) {
    res.render('admin_article',{
        title:'管理界面',
        isWrite:true,
        isList:false
       /* article:{}*/
    });
};


exports.new = function (req,res) {
    var _article = req.body;
    /* console.log(_article.title);
     console.log(_article.content);*/
    var article = new Article(_article);
    article.save(function (err,article) {
        if(err) {
            console.log(err);
            return res.send('保存失败');
        }
        return res.send('保存成功')
    });
};


exports.edit = function (req,res) {
    var id = req.query.id;
    if(id) {
        return res.render('admin_article',{
               title:'管理页面',
               isWrite:true,
               isList:false
        });
    }
    return res.redirect('/admin');
};


exports.detail = function (req,res) {
    var id = req.params.id;
    console.log(id);
    if(id) {
        Article.findById(id,function (err,article) {
            if(err) {
                console.log(err);
                return res.json({})
            }
            if(article) {
               return res.json(article);
            }
            return res.json({});
        });
    }
};

exports.update = function (req,res) {
    console.log(req.body);
    var _article = req.body;
    var id = _article.id;
    if(id) {
        Article.findById(id,function (err,article) {
            if(err) {
                console.log(err);
                return res.send('无该文章')
            }
            article.title = _article.title;
            article.content = _article.content;
            article.save(function (err,art) {
                 if(err) return res.send('更改失败');
                 return res.send('更改成功');
            });
        });
    }
};

exports.del = function (req,res) {
    var id = req.query.id;
    if (id) {
        Article.remove({_id:id},function (err,article) {
            if(err) {
                console.log('Delete article is failed, ERR is ' + err);
                return res.redirect('/admin/article/list');
            } else {
                return res.json({success:1});
            }
        })
    }
};