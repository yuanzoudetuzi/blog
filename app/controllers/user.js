/**
 * Created by Administrator on 2017/10/27.
 * 处理用户登陆
 */
var User = require('../models/user');

exports.showSignin = function (req,res) {
      res.render('sign',{
          title:'登陆界面',
          url:"signin"
      });
};

exports.showSignup = function (req,res) {
    res.render('sign',{
        title:'注册界面',
        url:"signup"
    });
};

exports.signin = function (req,res) {
    console.log('req :');
    console.log(req);
    var name = req.body.user.name;
    var password = req.body.user.password;
    User.findOne({name:name},function (err,user) {
         if(err) return console.log(err);
         if(!user) return res.send('用户不存在');
         user.comparePassord(password,function (err,isMacth) {
             if(err) return console.log(err);
             if(isMacth) {
                 req.session.user = user;
                 return res.redirect('/');
             } else {
                 return res.send('密码错误');
             }
         })
    });
};

exports.signup = function (req,res) {
    var _user = req.body.user;
    var name = _user.name;
    User.findOne({name:name},function (err,user) {
        if(err) return console.log(err);
        if(user) return res.send('用户名存在');
        var userTemp = new User(_user);
        userTemp.save(function (err,user) {
           if(err) return res.send('注册失败');
           return res.redirect('/signin');
        });

    });
};

exports.signinRequire = function (req,res,next) {
    var user = req.session.user;
    if(!user) return res.redirect('/signin');
    next();
};

exports.adminRequire = function (req,res,next) {
    var user = req.session.user;
    if(user.role<=10) return res.redirect('/');
    next();
};
