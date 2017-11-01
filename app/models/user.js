/**
 * Created by Administrator on 2017/10/27.
 */
var UserSchema = require('../schemas/user');
var moogoose = require('mongoose');
var User = moogoose.model('User',UserSchema);
module.exports = User;