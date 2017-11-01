/**
 * Created by Administrator on 2017/10/31.
 */
var mongoose = require('mongoose');
var ArticleSchema = require('../schemas/article');
var Article = mongoose.model('Article',ArticleSchema);
module.exports = Article;