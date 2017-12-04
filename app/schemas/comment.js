/**
 * Created by Administrator on 2017/11/17.
 * 评论模式
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 0;
var CommentSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    password:String,
    /*用户角色
     0:normal user
     1:verified user
     2:professional user
     >10:admin
     * */
    role:{
        type:Number,
        default:11
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

CommentSchema.pre('save',function (next) {
    var user = this;
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    //为密码加盐，加密
    bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt) {
        if(err) return next(err);
        var password = user.password;
        bcrypt.hash(password,salt,function (err,hash) {
            if(err) {
                console.log(err);
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

CommentSchema.methods  = {
    comparePassord:function (_password,cb) {
        bcrypt.compare(_password,this.password,function (err,isMatch) {
            if(err) return cb(err);
            cb(null,isMatch);
        });
    }
};

CommentSchema.statics = {
    fecth:function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById:function (id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb);
    }
};

module.exports = CommentSchema;