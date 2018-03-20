/**
 * Created by Administrator on 2017/10/31.
 */
var Article = require('../models/article');
var Category = require('../models/category');
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
    Category.fetch(function (err,categories) {
        if(err) return res.redirect('/admin');
     /*   console.log('categories :');
        console.log(categories);*/
        res.render('admin_article',{
            title:'管理界面',
            isWrite:true,
            isList:false,
            categories:categories
            /* article:{}*/
        });
    });
};


exports.new = function (req,res) {
    var _article = req.body;
    // console.log("_article");
    // console.log(_article);
    var categoryID;
  /*  var articleT;*/
   if(req.body.category) {
       console.log('not add category');
       categoryID = req.body.category;
       var article = new Article(_article);
       Category.findOne({_id:categoryID},function (err,category) {
           if(err) return res.send('不存在该分类');
           article.save(function (err,article) {
               if(err) {
                   console.log(err);
                   return res.send('保存失败');
               }
               // console.log('category');
               // console.log(category);
               // console.log(category.articles);
               category.articles.push(article._id);
               category.save(function (err,cat) {
                   if(err)  return res.send('文章创建成功，但不能添加到分类中');
                   // console.log('after push category:');
                   // console.log(cat);
                   return res.send('保存成功');
               });
           });

       });

   } else {
        console.log('add category');
       var _category = req.body.addCategory;
       var categoryNew = new Category({
           name:_category,
           articles:[]
       });
       categoryNew.save(function (err,category) {
           if(err) return res.send('创建新类型失败');
           _article['category'] = category._id;
           delete _article.addCategory;
           // console.log('after rectify _article:');
           // console.log(_article);
           var article = new Article(_article);
           article.save(function (err,article) {
               if(err) return res.send('保存失败');
               category.articles.push(article._id);
               category.save(function (err,cat) {
                   if(err)  return res.send('文章创建成功，但不能添加到分类中');
                   console.log('after push category:');
                   console.log(cat);
                   return res.send('保存成功');
               });

           });

       });
   }
};


exports.edit = function (req,res) {
    var id = req.query.id;
    if(id) {
        Category.fetch(function (err,categories) {
            if(err) return res.redirect('/admin');
          /*  console.log('categories :');
            console.log(categories);*/
            return res.render('admin_article',{
                title:'管理界面',
                isWrite:true,
                isList:false,
                categories:categories
                /* article:{}*/
            });
        });
    } else {
        return res.redirect('/admin');
    }

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
    var articleID = _article.id;
    var isAddCategory  = false;
    if( req.body.addCategory) {
        isAddCategory = true;
    } 
    
    Article.findById(articleID,function (err,article) {
        if(err) {
            console.log(err);
            return res.send('无该文章')
        }
        var lastCategory =  article.category;
       
        article.title = _article.title;
        article.abstact = _article.abstact;
        article.content = _article.content;
        if(!isAddCategory) {
            article.category = _article.category;
            article.save(function (err,art) {
                if(err) return res.send('更改失败');
                if(lastCategory!==_article.category) {
                    Category.findById(lastCategory,function (err,lastCat) {
                         if(err) return res.send("未能在旧分类中移除文章");
                         lastCat.removeArticle(articleID);
                        Category.findById(art.category,function (err,category) {
                            if(err) return res.send('更新分类中的文章列表失败');
                            category.articles.push(art._id);
                            category.save(function (err,cat) {
                                if(err)  return res.send('文章创建成功，但不能添加到分类中');
                                return res.send('保存成功');
                            });
                        });
                    });

                }
            });
        } else {
            console.log('req.body again:');
            console.log(req.body);
            var _category =  _article.addCategory;
            var categoryNew = new Category({name:_category});
            categoryNew.save(function (err,category) {
                 if(err) return res.send('创建新类型失败');
                article.category = category._id;
                article.save(function (err,art) {
                    if(err) return res.send('更改失败');
                    Category.findById(lastCategory,function (err,lastcat) {
                        if(err) return res.send('未能在旧分类中移除文章');
                        lastcat.removeArticle(articleID);
                        category.articles.push(art._id);
                        category.save(function (err,cat) {
                            if(err)  return res.send('文章创建成功，但不能添加到分类中');
                            return res.send('保存成功');
                        });
                    });
                });
            });
        }
    });
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