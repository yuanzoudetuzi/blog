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
                $('#inputTitle').val(data.title);
                editor.txt.html(data.content);
            }
        }
    });
}

function newPassage() {
        console.log(editor.txt.html());
        var content = editor.txt.html();
        title = $('#inputTitle').val();
        var data = {
            title: title,
            content:content
        };
        var dataSend = JSON.stringify(data);
        console.log(dataSend);
        $.ajax({
            url:"http://localhost:8080/admin/article/new",
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
    var content = editor.txt.html();
    title = $('#inputTitle').val();
    var data = {
        id:id,
        title: title,
        content:content
    };

    var dataSend = JSON.stringify(data);
    console.log(dataSend);
    $.ajax({
        url:"http://localhost:8080/admin/article/update",
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