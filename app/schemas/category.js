/**
 * Created by Administrator on 2017/10/31.
 * 分类模式
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
    name:{
        type:String,
        default:''
    },
    articles:[{
        type:ObjectId,
        ref:'Article',
        default:[]
      }
    ],
    meta:{
        creatAt:{
            type:Date,
            default:Date.now()
        },
        updateAt: {
            type:Date,
            default:Date.now()
        }
    }
});

CategorySchema.methods = {
    removeArticle:function (articleID,cb) {
        var len =  this.articles.length;
        var articles = this.articles;
        for(var i = 0; i < len;i++) {
            if(articles[i] === articleID) {
                this.articles.splice(i,1);
                break;
            }
        }
    }
};

CategorySchema.pre('save',function (next) {
    if(this.isNew) {
        this.meta.creatAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

CategorySchema.statics = {
    fetch:function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById:function (id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};

module.exports = CategorySchema;