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
        $('.item-id-'+id).css('border-bottom','2px solid #337ab7');
    } else {
        $('.item-all').css('border-bottom','2px solid #337ab7');
    }
    $.ajax()

}
);