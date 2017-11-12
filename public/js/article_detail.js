/**
 * Created by Administrator on 2017/11/9.
 */
$(document).ready(function () {
        var searchUrl = window.location.search;
        if (searchUrl.indexOf("?") != -1) {
            var str = searchUrl.substr(1);
            strs = str.split("=");
            id = strs[1];
            console.log(id);
            $.ajax({
                url:'/article/content/?id='+id,
                type:'GET',
                dataType:'json',
                success:function (data) {
                    if(data) {
                        console.log(data);
                        $('#article').html(data.content);
                    }
                }
            });
        }

    }
);