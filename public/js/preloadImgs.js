;(function ($) {

    function Preload(imgs,options) {
        this.imgs = (imgs instanceof Array)?imgs:[imgs];
        this.length = imgs.length;
        if(options&&options!=="") {
            this.opts = $.extend({},Preload.DEFAULTS,options);
        }
    }
    Preload.DEFAULTS = {
        order:"unordered",
        each:null, /*每张图片加载之后执行*/
        all:null   /*所有图片加载之后执行*/
    };
    Preload.prototype._unordered = function () {
        let imgs = this.imgs;
        let len = this.length;
        let that = this;
        let count = 0;
        $(imgs).each(function (i,src) {
            let imgObj = new Image();
            if(typeof src !== "string") return;
            $(imgObj).on("load err",function () {
                that.opts.each && that.opts.each(count);
                if(count>=len-1) {
                    return that.opts.all&&that.opts.all();
                }
                count++;
            });
            imgObj.src = src;
        });
    };
    Preload.prototype._ordered = function () {
        let imgs = this.imgs;
        let len = this.length;
        let that = this;
        let count = 0;
        load();
        function load() {
            console.log("load");
            let imgObj = new Image();
            $(imgObj).on("load err",function () {
                if(count>=len-1) {
                    return that.opts.all&&that.opts.all();
                } else {
                    that.opts.each && that.opts.each(count);
                    count++;
                    load();
                }

            });
            imgObj.src = imgs[count];
        }

    };

    /* $.fn.extend() -> $("#imgs").preload();*/
    $.extend({
        preload:function (imgs,opts) {
            let pre = new Preload(imgs,opts);
            if("ordered"===pre.opts.order) {
                pre._ordered();
            } else {
                pre._unordered();
            }

        }
    });
})(jQuery);