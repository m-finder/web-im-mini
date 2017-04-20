<?php
require_once 'class/config.php';
require_once 'class/url.php';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>M-finder WebIM</title>
        <link rel="stylesheet" href="static/layui/css/layui.css">
        <link rel="stylesheet" href="static/css/menu.css">
        <link href="favicon.ico" type="image/vnd.microsoft.icon" rel="shortcut icon"/>
    </head>

    <body data-token="<?php echo $uinfo['token']; ?>" data-rykey="<?php echo RY_KEY; ?>">
        <script src="static/layui/layui.js"></script>
        <script>
            //layui绑定扩展
            layui.config({
                base: 'static/js/'
            }).extend({
                rmlib: 'rmlib',
                protobuf: 'protobuf',
                socket: 'socket',
            });
            
            
            layui.use(['layim', 'jquery', 'socket'], function (layim, socket) {
                var $ = layui.jquery;
                var socket = layui.socket;
                var token = $('body').data('token');
                var rykey = $('body').data('rykey');

                // socket初始化。
                socket.config({
                    key: rykey,
                    token: token,
                    layim: layim,
                });

                layim.config({
                    init: {
                        url: 'class/doAction.php?action=get_user_data', data: {}
                    },
                    //获取群成员
                    members: {
                        url: 'json/getMembers.json', data: {}
                    }
                    //上传图片接口
                    , uploadImage: {
                        url: '/upload/image' //（返回的数据格式见下文）
                        , type: '' //默认post
                    }
                    //上传文件接口
                    , uploadFile: {
                        url: '/upload/file' //（返回的数据格式见下文）
                        , type: '' //默认post
                    }

                    , isAudio: true //开启聊天工具栏音频
                    , isVideo: true //开启聊天工具栏视频

                    //扩展工具栏
                    , tool: [{
                            alias: 'code'
                            , title: '代码'
                            , icon: '&#xe64e;'
                        }]
                    ,title: 'WebIM' 
                    ,copyright:true
                    , initSkin: '3.jpg' //1-5 设置初始背景
                    , notice: true //是否开启桌面消息提醒，默认false
                    , msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可
                    , find: layui.cache.dir + 'css/modules/layim/html/find.html' //发现页面地址，若不开启，剔除该项即可
                    , chatLog: layui.cache.dir + 'css/modules/layim/html/chatLog.html' //聊天记录页面地址，若不开启，剔除该项即可
                });  
            });
        </script>
    </body>

</html>
