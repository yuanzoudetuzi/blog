/**
 * Created by Administrator on 2017/10/27.
 */
//导航栏控制
$('.collapseItem').click(function () {
    let target = $(this);
    let memu = target.next();
    $(memu).slideToggle();
});

$('.del-category').click(function (e) {
    let target = $(e.target);
    let id = target.data('id');
    let tr = $('.item-id-'+id);
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
    let target = $(e.target);
    let id = target.data('id');
    let tr = $('.item-id-'+id);
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

