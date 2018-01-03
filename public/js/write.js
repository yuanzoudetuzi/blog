/**
 * Created by Administrator on 2017/10/30.
 */

var id,editor;
$(document).ready(function () {
    var E = window.wangEditor;
    editor = new E('#editor-tool','#editor-content');
    editor.customConfig.pasteFilterStyle = false;
    editor.customConfig.uploadImgShowBase64 = true ;  // 使用 base64 保存图片
    editor.create();

    console.log(window.location.search);
    /*判断是写文章还是编辑*/
    var url = window.location.search;
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("=");
        id = strs[1];
        getArticle(editor,id);
        $('#savePassage').click(updatePassage);
    } else {
        $('#savePassage').click(newPassage);
    }

    $('#clearPassage').click(function () {
        editor.txt.html('');
    });

});

function getArticle(editor,id) {
    $.ajax({
        url:'/admin/article/detail/'+id,
        type:'GET',
        dataType:'json',
        success:function (data) {
            if(data) {
                console.log('receive data:');
              /*  console.log(data);*/
                $('#inputTitle').val(data.title);
                $('#editor-des').val(data.abstract);
                $('#select-box').val(data.category);
                editor.txt.html(data.content);
            }
        }
    });
}

function newPassage() {
        console.log(editor.txt.html());
        var title = $('#inputTitle').val();
        var category = $('#select-box').val();
        var addCategory = $('#addCategory').val();
        var abstract = $('#editor-des').val();
        var content = editor.txt.html();

        var data = {
            title: title,
            abstract:abstract,
            content:content
        };
        if(addCategory) {
            data['addCategory'] = addCategory;
        } else {
            data['category'] = category;
        }
        var dataSend = JSON.stringify(data);
        console.log(dataSend);
        $.ajax({
            url:"/admin/article/new",
            type:'POST',
            data:dataSend,
            contentType : 'application/json',
            success:function (data) {
                console.log(data);
                $('#status').text(data);
                $('#status').fadeIn();
                setTimeout(function () {
                    $('#status').fadeOut();
                    $('#status').text('');
                },3000);
            }
        });
}

function updatePassage() {
    console.log('updatePassage');
    console.log('id = ' + id);
    var title = $('#inputTitle').val();
    var category = $('#select-box').val();
    var addCategory = $('#addCategory').val();
    var abstract = $('#editor-des').val();
    var content = editor.txt.html();

    var data = {
        id:id,
        title: title,
        abstract:abstract,
        content:content
    };
    if(addCategory) {
        data['addCategory'] = addCategory;
    } else {
        data['category'] = category;
    }
    var dataSend = JSON.stringify(data);
    console.log(dataSend);
    $.ajax({
        url:"/admin/article/update",
        type:'POST',
        data:dataSend,
        contentType : 'application/json',
        success:function (data) {
            console.log(data);
            $('#status').text(data);
            $('#status').fadeIn();
            setTimeout(function () {
                $('#status').fadeOut();
                $('#status').text('');
            },3000);
        }
    });
}