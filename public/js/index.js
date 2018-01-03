import "./preloadImgs.js"
import {Umbrella, Drop} from "./rain.js";
import {Sun, SunnyDoll} from "./sunshine.js"
import Cloud from "./cloud.js"

/*天气浮动框——知心天气*/
(function(T,h,i,n,k,P,a,g,e){g=function(){P=h.createElement(i);a=h.getElementsByTagName(i)[0];P.src=k;P.charset="utf-8";P.async=1;a.parentNode.insertBefore(P,a)};T["ThinkPageWeatherWidgetObject"]=n;T[n]||(T[n]=function(){(T[n].q=T[n].q||[]).push(arguments)});T[n].l=+new Date();if(T.attachEvent){T.attachEvent("onload",g)}else{T.addEventListener("load",g,false)}}(window,document,"script","tpwidget","//widget.seniverse.com/widget/chameleon.js"));
tpwidget("init", {
    "flavor": "slim",
    "location": "WM6N2PM3WY2K",
    "geolocation": "enabled",
    "language": "zh-chs",
    "unit": "c",
    "theme": "chameleon",
    "container": "tp-weather-widget",
    "bubble": "enabled",
    "alarmType": "badge",
    "uid": "U6090EE1AD",
    "hash": "1c63ab6c1cf99f15905b36eeea5d82c2"
});
tpwidget("show");

/*天气动画界面*/
$("html").attr("overflow-y", "hidden");
let canvas1 = document.getElementById("canvas1");
let canvas2 = document.getElementById("canvas2");
let canvasImgsArray = ["../imgs/cloud1.png","../imgs/cloud2.png","../imgs/cloud3.png",
                       "../imgs/rain.png","../imgs/sun.png","../imgs/sunny_doll1.png","../imgs/sunny_doll2.png"];
let pCanvas = document.getElementById("picture");
let context1 = canvas1.getContext("2d");
let context2 = canvas2.getContext("2d");
let pContext = pCanvas.getContext('2d');
let w1 = canvas1.width = $("main:first").width(),
    h1 = canvas1.height = window.innerHeight - $("nav.head:first").height(),
    w2 = canvas2.width = $("main:first").width(),
    h2 = canvas2.height = window.innerHeight - $("nav.head:first").height();
let pw,ph;

window.onresize = function () {
    w1 = canvas1.width = $("main:first").width();
    h1 = canvas1.height = window.innerHeight - $("nav.head:first").height();
    w2 = canvas2.width = $("main:first").width();
    h2 = canvas2.height = window.innerHeight - $("nav.head:first").height();
    pw = pCanvas.width = Math.floor(w1 * 2 / 10);
    ph = pCanvas.height = Math.floor(h1 * 4 / 10);
};
let ip =returnCitySN.cip;//获取用户IP
console.log("ip : " + ip);
/*根据用户ip获取用户位置，从而获取用户所在位置的天气*/
$.ajax({
    url: "/weather/?ip="+ip,
    type: "GET",
    dataType: "json",
    success: function (rec) {
        if(!rec.err) {
            console.log('weather data is:');
            console.log(rec);
            let {location,weather,temperature} = rec.data;
            // $("#location").html(location);
            // $("#weather").html(weather);
            // $("#temperature").html(temperature+" °C");
            $.preload(canvasImgsArray,{
                each:function () {
                },
                all:function () {
                    if(weather.indexOf("晴")!==-1) {
                        console.log("晴");
                        sunshine();
                    } else if (weather.indexOf("云")!==-1) {
                        console.log("多云");
                        sunshine();
                        cloudy();
                    } else if (weather.indexOf("阴")!==-1) {
                        console.log("阴");
                        cloudy();
                     } else if (weather.indexOf("雨")!==-1) {
                        console.log("雨");
                        rain();
                    } else {
                       console.log("未知");
                    }

                }
            });
        }
        else {
            console.log(rec.err);
        }
    },
    err: function (err) {
        console.log("Get weather is error,because " + err);
    }
});
/*创建雨滴数组*/
function rain() {
    $("#text").show();
    $("#picture").css({
        "top":"60%",
        "left":"80%"
    });
    pw = pCanvas.width = Math.floor(w1 * 2 / 10);
    ph = pCanvas.height = Math.floor(h1 * 4 / 10);
    pContext.fillStyle = 'rgba(255, 255, 255, 0)';
    pContext.fillRect(0, 0, pw, ph);
    let drops = [];
    /*雨滴数组*/
    let num = 1000;
    let rainImage = new Image();
    rainImage.src = "../imgs/rain.png";
    for (let i = 0; i < num; i++) {
        /*延迟添加*/
        setTimeout(function () {
            let drop = new Drop(context1, w1, h1);  //创建雨滴对象
            // drop.init();            /*初始化雨滴*/
            drops.push(drop);
        }, 1000 / 60 * i);
    }
    /*创建撑伞类，并绘制*/
    let um = new Umbrella(pContext, pw, ph);
    um.draw(rainImage);
    setInterval(function () {
        //        清除之前的图形
        context1.clearRect(0, 0, w1, h1);
        for (let i = 0; i < drops.length; i++) {
            drops[i].draw();
        }
    }, 1000/60);
}

function sunshine() {
    $("#text").hide();
    $("#picture").css({
        "top":"10px",
        "left":"10%"
    });
    pw = pCanvas.width = Math.floor(w1/10);
    ph = pCanvas.height = Math.floor(w1/10);
    pContext.fillStyle = 'rgba(255, 255, 255, 0)';
    pContext.fillRect(0, 0, pw, ph);
    let sun = new Sun(pContext,pw,ph);
    let sunImage = new Image();
    sunImage.src = "imgs/sun.png";
    sun.draw(sunImage);
    setInterval(function () {
        sun.rotate();
        sun.draw(sunImage);
    },500);

    let sunnyDoll = new SunnyDoll(context1,w1,h1);
    let sunnyDollImage1 = new Image();
    let sunnyDollImage2 = new Image();
    sunnyDollImage2.src = "imgs/sunny_doll2.png";
    sunnyDollImage1.src = "imgs/sunny_doll1.png";
    sunnyDoll.draw(sunnyDollImage1);
    let count = 1;
    setInterval(function () {
        sunnyDoll.move();
        if(count%2===1) {
            sunnyDoll.draw(sunnyDollImage2);
        } else {
            sunnyDoll.draw(sunnyDollImage1);
        }
        count++;
        if(count ===200) {
            count =0;
        }
    },1000/6);
}

function cloudy() {
    let cloud1 = new Cloud(context2,w2,h2,w2*0.1,w2/35);
    let cloud2 = new Cloud(context2,w2,h2);
    let cloud3 = new Cloud(context2,w2,h2);
    let cloudImage1 = new Image();
    let cloudImage2 = new Image();
    let cloudImage3 = new Image();
    cloud1.draw(cloudImage1);
    cloud2.draw(cloudImage2);
    cloud3.draw(cloudImage3);
    cloudImage1.src = "imgs/cloud1.png";
    cloudImage2.src = "imgs/cloud2.png";
    cloudImage3.src = "imgs/cloud3.png";
    setInterval(function () {
        context2.clearRect(0,0,w2,h2);
        cloud2.move();
        cloud3.move();
        cloud1.draw(cloudImage1);
        cloud2.draw(cloudImage2);
        cloud3.draw(cloudImage3);
    },1000/60);
}


