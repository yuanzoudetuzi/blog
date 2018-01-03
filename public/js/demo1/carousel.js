;(function ($) {
    var Carousel = function (poster) {
        var _self = this;
        this.poster = poster;
        this.posterItemMain = this.poster.find(".poster-list");
        this.nextBtn = this.poster.find(".poster-next-btn");
        this.prevBtn = this.poster.find(".poster-pre-btn");
        this.posterItems = this.posterItemMain.find(".poster-item");

        if(this.posterItems.length%2===0) {     /*偶数帧*/
            this.posterItemMain.append(this.posterItems.eq(0).clone());
            this.posterItems =this.posterItemMain.children();
        }
        this.zIndex = this.posterItems.length / 2;
        this.posterFirstItem = this.posterItems.first();
        this.posterLastItem = this.posterItems.last();
        this.rotateFlag = true;

        /*判断旋转动画是否执行完毕*/
        this.setting = {
             width: 1000, /*幻灯片宽度*/
             height: 270, /*幻灯片高度*/
             posterWidth: 640, /*第一帧宽度*/
             posterHeight: 270, /*第一帧高度*/
             scale: 0.9,        /*幻灯片的缩放比例*/
             speed: 500,        /*动画速度，单位ms*/
             delay:1500,        /*自动播放速度*/
             autoPlay:false,
             verticalAlign: "middle"
        };
        // console.log(this.setting);
        // console.log(this.getSetting());
        $.extend(this.setting, this.getSetting());
        console.log(this.setting);
        this.setSettingValue();
        this.setPosterPos();
        this.nextBtn.click(function () {
            if (_self.rotateFlag) {
                _self.rotateFlag = false;
                _self.carouselRotate("left");
            }
        });
        this.prevBtn.click(function () {
            if (_self.rotateFlag) {
                _self.rotateFlag = false;
                _self.carouselRotate("right");
            }

        });
    //    是否开启自动播放
        if(this.setting.autoPlay) {
            this.autoPlay();
            this.poster.hover(function () {
                window.clearInterval(_self.timer);
            },function () {
                _self.autoPlay();
            })
        }
    };
    Carousel.prototype = {
        //自动播放
        autoPlay:function () {
           var _this = this;
           this.timer = window.setInterval(function () {
               _this.nextBtn.click();
           },_this.setting.delay);
        },
        //旋转
        carouselRotate: function (type) {
            var _this = this;
            var itemsArr = [];
            this.posterItems.each(function () {
                var self = $(this);
                var item;
                if (type === "left") {           /*向左旋转*/
                    item = self.prev().get(0) ? self.prev() : _this.posterLastItem;
                } else {                     /*向右旋转*/
                    item = self.next().get(0) ? self.next() : _this.posterFirstItem;
                }
                var width = item.width(),
                    height = item.height(),
                    zIndex = item.css("zIndex"),
                    opacity = item.css("opacity"),
                    top = item.css("top"),
                    left = item.css('left');
                /*保存每个幻灯片的前一个幻灯片的参数值*/
                var itemObj = {
                    width: width,
                    height: height,
                    zIndex: zIndex,
                    opacity: opacity,
                    left: left,
                    top: top
                };
                itemsArr.push(itemObj);

            });
            //为每个幻灯片赋值其前一个幻灯片的参数值
            this.posterItems.each(function(i){
                $(this).animate({
                    width: itemsArr[i].width,
                    height: itemsArr[i].height,
                    zIndex: itemsArr[i].zIndex,
                    opacity: itemsArr[i].opacity,
                    left: itemsArr[i].left,
                    top: itemsArr[i].top
                },_this.setting.speed,function () {
                    _this.rotateFlag = true;
                });
            });
        },
        //获取人工配置参数
        getSetting: function () {
            var setting = this.poster.data("setting");
            if (setting && setting !== "") {
                return setting;
            } else {
                return {}
            }
        },
        //   设置配置参数值控制基本的宽高
        setSettingValue: function () {
            this.poster.css({
                width: this.setting.width,
                height: this.setting.height
            });
            this.posterItemMain.css({
                width: this.setting.width,
                height: this.setting.height
            });
            var w = (this.setting.width - this.setting.posterWidth) / 2;
            this.prevBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.zIndex)
            });
            this.nextBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.zIndex)
            });
            this.posterFirstItem.css({
                left: w,
                width: this.setting.posterWidth,
                height: this.setting.posterHeight,
                zIndex: Math.floor(this.zIndex)
            })
        },
        //设置剩余幻灯片位置
        setPosterPos: function () {
            var _self = this;
            var sliceItems = this.posterItems.slice(1),
                slength = sliceItems.length / 2,
                rightItems = sliceItems.slice(0, slength),
                leftItems = sliceItems.slice(slength),
                scale = this.setting.scale,
                level = Math.floor(slength);
            var rw = this.setting.posterWidth,
                rh = this.setting.posterHeight,
                gap = (this.setting.width - this.setting.posterWidth) / (2 * level);
            var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
            var fixOffetLeft = firstLeft + rw;
            rightItems.each(function (i) {
                level--;
                rw *= scale;
                rh *= scale;
                var j = i;
                $(this).css({
                    zIndex: level,
                    width: rw,
                    height: rh,
                    opacity: 1 / (++i),
                    left: fixOffetLeft + (++j) * gap - rw,
                    top: _self.setVertualAlign(rh)
                })
            });
            var lw = rightItems.last().width(), /*右边最后一张幻灯片宽度*/
                lh = rightItems.last().height(), /*右边最后一张幻灯片高度*/
                oloop = Math.floor(slength);
            leftItems.each(function (i) {
                var j = i;
                $(this).css({
                    zIndex: i,
                    width: lw,
                    height: lh,
                    opacity: 1 / oloop,
                    left: i * gap,
                    top: _self.setVertualAlign(lh)
                });
                lw /= scale;
                lh /= scale;
                oloop--;
            });
        },
        //    设置顶部对齐
        setVertualAlign: function (height) {
            var vertualType = this.setting.verticalAlign,
                top = 0;
            switch (vertualType) {
                case "top":
                    top = 0;
                    break;
                case "middle":
                    top = (this.setting.height - height) / 2;
                    break;
                case "bottom":
                    top = this.setting.height - height;
                    break;
                default:
                    top = (this.setting.height - height) / 2;
            }
            return top;
        }
    };
    Carousel.init = function (posters) {
        var _this = this;
        posters.each(function (i, ele) {
            new _this($(this));
        })
    };
    $.extend({
        carousel:function (poster) {
            Carousel.init(poster);
        }
    });
    // window["Carousel"] = Carousel;
})(jQuery);