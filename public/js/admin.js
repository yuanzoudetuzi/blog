/**
 * Created by Administrator on 2017/10/27.
 */
//导航栏控制
$('.collapseItem').click(function () {
    var target = $(this);
    var memu = target.next();
    $(memu).slideToggle();
});

$('.del-category').click(function (e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-'+id);
    $.ajax({
        type:'DELETE',
        url:'/admin/category/list?id='+id,
        success:function (res) {
            if(res.success ===1) {
                if(tr.length >0) {
                    tr.remove();
                }
            }
        }
    });
});


$('.del-article').click(function (e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-'+id);
    $.ajax({
        type:'DELETE',
        url:'/admin/article/list?id='+id,
        success:function (res) {
            if(res.success ===1) {
                if(tr.length >0) {
                    tr.remove();
                }
            }
        }
    });
});

