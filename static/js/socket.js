layui.define(['jquery', 'layer', 'rmlib', 'protobuf'], function (exports) {
    var lib = layui.rmlib;
    var $ = layui.jquery;
    var layer = layui.layer;

    var conf = {
        uid: 0, //连接的用户id，必须传
        key: '', //融云key
        layim: null,
        token: null,
    };

    var socket = {
        config: function (options) {
            conf = $.extend(conf, options); //把layim继承出去，方便在register中使用
            console.log('当前用户配置 ：' + options);
            this.register();
            im.init(options.key);
            im.connectWithToken(options.token);
        },
        register: function () {
            var layim = conf.layim;
            if (layim) {
                //监听在线状态的切换事件
                layim.on('online', function (data) {
                    console.log('在线状态'+data);
                });
                //监听签名修改
                layim.on('sign', function (value) {
                    console.log(value);
                    $.post('class/doAction.php?action=change_sign', {sign: value}, function (data) {
                        console.log('签名修改'+data);
                    });
                });
                //监听自定义工具栏点击，以添加代码为例
                layim.on('tool(code)', function (insert) {
                    layer.prompt({
                        title: '插入代码'
                        , formType: 2
                        , shade: 0
                    }, function (text, index) {
                        layer.close(index);
                        insert('[pre class=layui-code]' + text + '[/pre]'); //将内容插入到编辑器
                    });
                });
                //监听layim建立就绪
                layim.on('ready', function (res) {
                    //console.log(res.mine);
                    layim.msgbox(5); //模拟消息盒子有新消息，实际使用时，一般是动态获得
                    //添加好友（如果检测到该socket）

                    layim.addList({
                        type: 'group'
                        , avatar: "static/img/tel.jpg"
                        , groupname: '海贼世界'
                        , id: "1"
                        , members: 0
                    });
                    im.joinGroup('1', '海贼世界');  //加入融云群组
                });
                
                //监听查看群员
                layim.on('members', function (data) {
                    console.log('群成员'+data);
                });
                
                //监听聊天窗口的切换
                layim.on('chatChange', function (res) {
                    var type = res.data.type;
                    console.log(res.data.id)
                    if (type === 'friend') {
                        //模拟标注好友状态
                        //layim.setChatStatus('<span style="color:#FF5722;">在线</span>');
                    } else if (type === 'group') {
                        //模拟系统消息
//                        layim.getMessage({
//                            system: true
//                            , id: res.data.id
//                            , type: "group"
//                            , content: '模拟群员' + (Math.random() * 100 | 0) + '加入群聊'
//                        });
                    }
                });
                layim.on('sendMessage', function (data) { //监听发送消息
                    console.log(data);
                    im.sendMsg(data);
                });
            }
        },
    };

    var im = {
        init: function (key) { //初始化融云key
            lib.RongIMClient.init(key);
            console.log('key');
            this.initListener();    //初始化事件监听
            this.defineMessage();   //初始化自定义消息类型
        },
        initListener: function () { //初始化监听
            console.log('注册服务连接监听事件');
            RongIMClient.setConnectionStatusListener({//连接监听事件
                onChanged: function (status) {
                    switch (status) {
                        case lib.ConnectionStatus.CONNECTED: //链接成功
                            console.log('链接成功');
                            break;
                        case lib.ConnectionStatus.CONNECTING: //正在链接
                            console.log('正在链接');
                            break;
                        case lib.ConnectionStatus.DISCONNECTED: //重新链接
                            console.log('断开连接');
                            break;
                        case lib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT://其他设备登录
                            console.log('其他设备登录');
                            break;
                        case lib.ConnectionStatus.ConnectionStatus.NETWORK_UNAVAILABLE: //网络不可用
                            console.log('网络不可用');
                            break;
                    }
                }});

            RongIMClient.setOnReceiveMessageListener({// 消息监听器
                onReceived: function (message) { // 接收到的消息
                    console.log(message);
                    switch (message.messageType) { // 判断消息类型
                        case RongIMClient.MessageType.LAYIM_TEXT_MESSAGE:
                            conf.layim.getMessage(message.content);
                            break;
                    }
                }
            });
        },
        connectWithToken: function (token) {    //连接事件
            RongIMClient.connect(token, {
                onSuccess: function (userId) {
                    console.log("Login successfully." + userId);
                },
                onTokenIncorrect: function () {
                    console.log('token无效');
                },
                onError: function (errorCode) {
                    console.log('发送失败:' + errorCode);
                }
            });
        },
        //融云自定义消息，把消息格式定义为layim的消息类型
        defineMessage: function () {
            var defineMsg = function (obj) {
                RongIMClient.registerMessageType(obj.msgName, obj.objName, obj.msgTag, obj.msgProperties);
            }
            //注册普通消息
            var textMsg = {
                msgName: 'LAYIM_TEXT_MESSAGE',
                objName: 'LAYIM:CHAT',
                msgTag: new lib.MessageTag(false, false),
                msgProperties: ["username", "avatar", "id", "type", "content"]
            };
            //注册
            console.log('注册用户自定义消息类型：LAYIM_TEXT_MESSAGE');
            defineMsg(textMsg);

        },
        sendMsg: function (data) {  //根据layim提供的data数据，进行解析
            console.log(data);
            var mine = data.mine;
            var to = data.to;
            var id = mine.id;   //当前用户id
            var group = to.type == 'group';
            if (group) {
                id = to.id;     //如果是group类型，id就是当前groupid，切记不可写成 mine.id否则会出现一些问题。
            }
            //构造消息
            var msg = {
                username: mine.username
                , avatar: mine.avatar
                , id: id
                , type: to.type
                , content: mine.content
            };
            //这里要判断消息类型
            var conversationType = group ? lib.ConversationType.GROUP : lib.ConversationType.PRIVATE; //私聊,其他会话选择相应的消息类型即可。
            var targetId = to.id.toString();        //这里的targetId必须是string类型，否则会报错
            //构造消息体，这里就是我们刚才已经注册过的自定义消息
            console.log(msg);
            var detail = new RongIMClient.RegisterMessage.LAYIM_TEXT_MESSAGE(msg);
            //发送消息
            RongIMClient.getInstance().sendMessage(conversationType, targetId, detail, {
                onSuccess: function (message) {
                    console.log('发送消息成功');
                },
                onError: function (errorCode, message) {
                    console.log('发送失败:' + errorCode);
                }
            });
        },
        joinGroup: function (gid, gname) {
            var groupId = (gid || '0').toString();  // 群 Id 。
            var groupName = gname;                  // 群名称 。
            RongIMClient.getInstance().joinGroup(groupId, groupName, {
                onSuccess: function () {
                    console.log('加入群成功');
                },
                onError: function (error) {
                    console.log(error);
                }
            });
        },
    };


    exports('socket', socket);
});