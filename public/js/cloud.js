import random from "./random.js"
class Cloud {
    constructor(context,w,h,x,y) {
        if(x&&x!=="") {
            this.x = x;
        } else {
            this.x = random(0.05*w,0.1*w);
        }
        if(y&&y!=="" ){
            this.y = y;
        } else {
            this.y = random(0.15*h,0.2*h);
        }
        this.vx = random(1,3);
        this.pictureHeight = random(0.08*h,0.09*h);
        this.pictureWidth = random(0.15*w,0.16*w);
        this.context = context;
        this.w = w;/*画布宽度*/
        this.h = h;  /*画布高度*/
    }
    init(){
        this.x = random(0.05*this.w,0.1*this.w);
        this.y = random(0.15*this.h,0.2*this.h);
        this.vx = random(1,3);
        this.vx = random(1,3);
        this.pictureHeight = random(0.08*this.h,0.09*this.h);
        this.pictureWidth = random(0.15*this.w,0.16*this.w);
    }
    draw(img) {
        let imgWidth = img.width;
        let imgHeight = img.height;
        let ratio = 1;
        if(imgHeight > imgWidth) {   /*竖图*/
            ratio = imgHeight/this.pictureHeight;
        } else {
            ratio = imgWidth/this.pictureWidth;
        }
        let drawWidth = imgWidth/ratio;
        let drawHeight = imgHeight/ratio;
        this.context.drawImage(img,this.x,this.y,drawWidth,drawHeight);
        this.context.fillStyle = "#000";
    }
    move () {
        if(this.x >= this.w) {
            this.init();
        } else {
            this.x +=this.vx
        }

    }
}
export default Cloud;