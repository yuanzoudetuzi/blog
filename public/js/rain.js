
import random from "./random.js";
/*撑伞图片类*/
class Umbrella {
     constructor(context,w,h){
         this.x = random(0,0.05*w);  /*图片在画布上的起始坐标x*/
         this.y = random(0,0.05*h);  /*图片在画布上的起始坐标y*/
         this.context = context;
         this.w = w;   /*画布宽度*/
         this.h = h;  /*画布高度*/
     }
    draw(img) {
        let imgWidth = img.width;
        let imgHeight = img.height;
        console.log(imgWidth + " " + imgHeight);
        let ratio = 1;
        if(imgHeight > imgWidth) {   /*竖图*/
            ratio = imgHeight/this.h;
        } else {
            ratio = imgWidth/this.w;
        }
        let drawWidth = imgWidth/ratio;
        let drawHeight = imgHeight/ratio;
        this.context.drawImage(img,this.x,this.y,drawWidth,drawHeight);
    }
}

/*雨滴类*/
class Drop {
    constructor(context,w,h){
        this.x = random(0,w);
        this.y = 0;
        this.w = w;  /*画布宽度*/
        this.h = h;  /*画布高度*/
        this.vy = random(10,11) ; /*生成随机下落速度*/
        this.l = random(0.95*this.h,0.99*this.h); /*下落的随机高度*/
        this.r = random(1,2);  /*随机生成圆的半径*/
        this.vr = 1;  /*圆半径变化速度*/
        this.a = 0.5; /*透明度初始值*/
        this.va = 0.8;/*透明度变化系数*/
        this.context = context;
    }
    init() {
        this.x = random(0,this.w);
        this.y = 0;
        this.vy = random(10,11) ; /*生成随机下落速度*/
        this.l = random(0.95*this.h,0.99*this.h); /*下落的随机高度*/
        this.r = random(1,2);  /*随机生成圆的半径*/
        this.vr = 1;  /*圆半径变化速度*/
        this.a = 0.5; /*透明度初始值*/
        this.va = 0.8;/*透明度变化系数*/
    }
    draw () {
        if(this.y < this.l) {
            this.context.fillStyle = "rgba(0,0,0,0.5)";
            this. context.fillRect(this.x,this.y,2,10);
        } else {
            if(this.a >0.03) {
                this.r += this.vr;
                if(this.r > 5) {  /*b半径大于5之后，开始变模糊*/
                    this.a *= this.va;
                }
            } else {
                /*重新初始化雨滴*/
                this.init();
            }
            this.context.strokeStyle = "rgba(0,0,0,+" + this.a + ")";
            this.context.beginPath();  /*重新开始路径*/
            this.context.arc(this.x,this.y,this.r,0,Math.PI,true);
            this.context.stroke();  /*触笔方法，绘制成线条*/
        }
        this.update();
    }
//        更新坐标
    update () {
        if(this.y < this.l) {
            this.y += this.vy;
        }
    }
}
export {Umbrella,Drop};
