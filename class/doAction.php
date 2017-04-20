<?php

#包含所需文件
require_once 'config.php';
require_once 'PdoMySQL.class.php';

#实例化pdo，redis，并设置redis监听端口
$PdoMySQL = new PdoMySQL;

#执行动作获取
$act = empty($_GET['action']) ? null : $_GET['action'];

switch ($act) {

    #user login
    case 'login':

        $param = $_POST;
        
        $pwd = md5($param['pwd']);

        $tables = 'user';
        $get_user = $PdoMySQL->find($tables, 'name = "' . $param['name'] . '"', 'id,pwd,sign,avatar');
        
        if (empty($get_user)) {
            echo '{"code":"002","status":"n","info":"您输入的用户名不存在，请查证后重试"}';
            exit;
        } else {
            if ($pwd !== $get_user['pwd']) {
                echo '{"code":"002","status":"n","info":"您输入的密码错误，请查证后重试"}';
                exit;
            } else {
                $_SESSION['user_id'] = $get_user['id'];
                $_SESSION['user_name'] = $param['name'];

                #引入融云api
                include 'API/rongcloud.php';
                $appKey = RY_KEY;
                $appSecret = RY_SECRET;
                $RongCloud = new RongCloud($appKey, $appSecret);

                #获取token，成功则保存session
                $arr = array(
                    'id' => $get_user['id'],
                    'username' => $param['name'],
                    'sign'=>$get_user['sign'],
                    'avatar'=>$get_user['avatar'],
                );
                
                if ($RongCloud) {
                    $result = $RongCloud->user()->getToken($get_user['id'], $param['name'], 'localhost/static/img/'.$get_user['avatar'].'');
                    $arr['token'] =  $token = json_decode($result, true)['token'];
                    $_SESSION['info'] = $arr;
                    echo '{"code":"0","status":"y","info":"欢迎回来"}';
                } else {
                    echo '{"code":"001","status":"n","info":"聊天系统初始化失败，请重新登录"}';
                }
            }
        }
        break;
    #获取用户信息，好友列表
    case 'get_user_data':
        $uid = $_SESSION['user_id'];
        $uname = $_SESSION['user_name'];
        
        $sql = "select name as groupname,id,online from usergroup where uid = '$uid' ";
        $get_my_group = $PdoMySQL->getAll($sql);
        foreach($get_my_group as $key => $val){
            $sql2 = "select user.id,user.name as username,user.sign,user.avatar from friends left join user on user.id = friends.fid where friends.status = 1 and friends.uid = '$uid' and friends.gid = '{$val['id']}' ";
            $get_my_friend = $PdoMySQL->getAll($sql2);
            $get_my_group[$key]['list'] = $get_my_friend;
        }
        $get_my_groups = json_encode($get_my_group);
        echo '{"code": 0,"msg": "","data": {"mine":' . json_encode($_SESSION['info']) . ',"friend": ' . $get_my_groups . ' }}';
        break;
    default :
        echo '{"code":"9999","status":"n","info":"关键参数传入错误，请返回请求来源网址"}';
        break;
}

