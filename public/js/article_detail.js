/**
 * Created by Administrator on 2017/11/9.
 */
let seasonImgsArray = ["/imgs/spring.png","/imgs/summer.png","/imgs/autumn.png","/imgs/winter.png"];
$(document).ready(function () {
    changeSeasonTree();
    let searchUrl = window.location.search;
    console.log('searchUrl = ' + searchUrl);
    if (searchUrl.indexOf("?") !== -1) {
        let str = searchUrl.substr(1);
        let strs = str.split("=");
        let id = strs[1];
        console.log(id);
        $.ajax({
            url:'/article/content/?id='+id,
            type:'GET',
            dataType:'json',
            success:function (data) {
                if(data) {
                    $('#article').html(data.content);
                }
            }
        });
        $('.like').click(function () {
            $.ajax({
                url:'/article/like/?id='+id,
                type:'GET',
                dataType:'json',
                success:function (data) {
                    if(data.status===1) {
                        console.log(data);
                        $("#like_num").html(++num);
                    }
                }
            });
        });
    }
}
);


function changeSeasonTree() {
    let i = 0;
    let speed = 6;  /*单位s*/
    setTimeout(function () {
        $(".season-tree").animate({opacity: '0'},1000*speed/3,function () {
            $(".season-tree").css({
                "backgroundImage":"url("+seasonImgsArray[i]+")"
            }).animate({opacity: '1'},1000*speed/3);
        });
    },0);
    setInterval(function () {
        if(3===i) {
            i=0;
        }
        $(".season-tree").animate({opacity: '0'},1000*speed/3,function () {
            $(".season-tree").css({
                "backgroundImage":"url("+seasonImgsArray[++i]+")"
            }).animate({opacity: '1'},1000*speed/3);
        });

    },1000*speed);

}