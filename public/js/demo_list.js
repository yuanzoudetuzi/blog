$(document).ready(function () {
    let demoBox = $(".demo-box");
    let w = demoBox.width();
    $(window).resize(function () {
        w = demoBox.width();
        demoBox.css({
            "height": w*6/9+"px"
        });
    });
    demoBox.css({
       "height": w*6/9+"px"
    });
});