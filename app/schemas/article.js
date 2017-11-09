/**
 * Created by Administrator on 2017/10/31.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var ArticleSchema = Schema({
     title:{
         type:String,
         default:''
     },
     content:{
         type:String,
         default:''
     },
     abstract:{
         type:String,
         default:''
     },
     category:{
         type:ObjectId,
         ref:'Category'
     },
     watchNumber:{
         type:Number,
         default:0
     },
    commentNumber:{
        type:Number,
        default:0
    },
    likeNumber:{
        type:Number,
        default:0
    },
     meta:{
         createAt:{
             type:Date,
             default:Date.now()
         },
         updateAt:{
             type:Date,
             default:Date.now()
         }
     }
});

ArticleSchema.pre('save',function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
   next();
});

ArticleSchema.statics = {
    fetch:function (cb) {
        return this
            .find({})
            .sort({'meta.updateAt':-1})
            .exec(cb);
    },
    findById:function (id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};


module.exports = ArticleSchema;