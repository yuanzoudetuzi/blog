/**
 * Created by Administrator on 2017/10/31.
 */
// var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 var ObjectId = Schema.Types.ObjectId;
// let month = Math.floor(2*Math.random());
// let day = Math.floor(30*Math.random());
// let hour = Math.floor(8+14*Math.random());
// let minute = Math.floor(60*Math.random());
// let second = Math.floor(60*Math.random());
// let date1 = Date.UTC(2017,11,day,hour,minute,second);
// let date2 = Date.UTC(2018,month,day,hour,minute,second);
// let dateArr = [date1, date2];
// let index = Math.floor(2*Math.random());
// let date = dateArr[index];
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
             // default: date
         },
         updateAt:{
             type:Date,
             default:Date.now()
             // default: date
         }
     }
});

ArticleSchema.pre('save',function (next) {
    // let month = Math.floor(2*Math.random());
    // let day = Math.floor(30*Math.random());
    // let hour = Math.floor(8+14*Math.random());
    // let minute = Math.floor(60*Math.random());
    // let second = Math.floor(60*Math.random());
    // let date1 = Date.UTC(2017,11,day,hour,minute,second);
    // let date2 = Date.UTC(2018,month,day,hour,minute,second);
    // let dateArr = [date1, date2];
    // let index = Math.floor(2*Math.random());
    // let date = dateArr[index];
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
       // this.meta.createAt = this.meta.updateAt =  date;
    } else {
         this.meta.updateAt = Date.now();
        // let tempDate = this.meta.updateAt;
        // tempDate.setDate(tempDate.getDate()+1);
        // this.meta.updateAt =  tempDate;
    }
    // console.log('this.meta.createAt');
    // console.log(this.meta.createAt);
    // console.log('this.meta.updateAt');
    // console.log(this.meta.updateAt);
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