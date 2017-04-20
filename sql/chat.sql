-- phpMyAdmin SQL Dump
-- version phpStudy 2014
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2017 年 04 月 20 日 14:36
-- 服务器版本: 5.5.53
-- PHP 版本: 5.4.45

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `chat`
--

-- --------------------------------------------------------

--
-- 表的结构 `friends`
--

CREATE TABLE IF NOT EXISTS `friends` (
  `gid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `addtime` int(11) NOT NULL,
  KEY `gid` (`gid`,`uid`,`fid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `friends`
--

INSERT INTO `friends` (`gid`, `uid`, `fid`, `status`, `addtime`) VALUES
(1, 1, 2, 1, 123456),
(2, 2, 1, 1, 123456),
(1, 1, 3, 1, 123456),
(3, 3, 1, 1, 123456);

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `pwd` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `sign` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `name`, `pwd`, `sign`, `avatar`) VALUES
(1, 'Luffy', '7fef6171469e80d32c0559f88b377245', '我要当大神', 'static/img/logo.jpg'),
(2, 'Shanks', '7fef6171469e80d32c0559f88b377245', '给我个面子如何？', 'static/img/Shanks.jpg'),
(3, 'Buggy', '7fef6171469e80d32c0559f88b377245', '我是巴基大神', 'static/img/Buggy.jpg');

-- --------------------------------------------------------

--
-- 表的结构 `usergroup`
--

CREATE TABLE IF NOT EXISTS `usergroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `name` varchar(20) COLLATE utf8_unicode_ci DEFAULT '好友分组',
  `online` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `usergroup`
--

INSERT INTO `usergroup` (`id`, `uid`, `name`, `online`) VALUES
(1, 1, '那些年我遇到的大神', 0),
(2, 2, '我的好友', 0),
(3, 3, '我的好友', 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
