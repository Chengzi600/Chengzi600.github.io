---
title: 我如何从零搭建 Hexo Blog 并托管到 Github Pages
author: Chengzi600
tags:
  - hexo
  - 教程
categories:
  - 编程
  - Web
abbrlink: 28473
date: 2024-02-22 16:02:00
updated: 2024-02-22 16:02:00
---

## 前言

之前尝试过自己搭建动态的 BLOG，然而光是域名+服务器的费用就是一个不小的数字。所以这次采用了一个快速、简洁且高效的博客框架 **hexo**，以便于将其免费托管到 Github Pages

## 准备工作

> 💻我的搭建环境：Windows 10, Node.js v18.19.0, npm v10.2.3

1. Win 10 电脑建议下载一个终端，Win 11是自带的，如果不想装也可以用Git Bash，但不建议使用CMD或者PowerShell

2. 安装 Node.js，安装完了之后在终端输入下面的命令，如果显示出来版本号就说明好了

<!-- more -->

```
C:\Users\15573>node -v
v18.19.0

C:\Users\15573>npm -v
10.2.3
```

3. 安装 Git，用于后续推送 Github

4. 一个 Github 账号

## 搭建

### 安装 Hexo

新建一个文件夹，右键打开终端（或点击Git Bash Here）

为了防止下载速度过慢，一直卡在`timing xxx`，建议换国内源后再操作

```bash
npm config set registry https://registry.npm.taobao.org
```

依次输入下面的命令，`myblog`可以换成任意名称

```bash
npm install -g hexo-cli
hexo init myblog
```

耐心等待初始化，完成后会在你打开终端的目录下新建`myblog`文件夹和一个json文件，我们切换到文件夹，补全hexo所需的文件

```bash
cd myblog
npm install
```

接下来生成静态文件，并启动hexo服务器

```bash
hexo g
hexo s
```

根据提示访问`localhost:4000`就能看到你生成的博客了

### 配置信息

让我们来熟悉一下几个重要的目录和文件

- node_modules: 存放依赖包以及你安装的插件
- public：存放生成的页面
- scaffolds：存放模板文件
- source：存放文章
- **themes：存放主题**
- **_config.yml: 博客的全局配置文件**

进入`_config.yml`编辑`Site`这部分信息

```yml
# Site
title: 橙BLOG
subtitle: '橙子的BLOG'
description: '靠自己，实际一些！'
keywords:
author: Chengzi600
language: en
timezone: ''
```

如果怕改坏可以先备份配置文件

用`Ctrl+C`结束hexo进程，然后使用`hexo s`重启服务器

进去看看，你会发现内容应用上去了，不过还有些内容我们需要配置主题的配置文件修改

### 配置主题

点开[Themes | Hexo](https://hexo.io/themes/)这个链接，寻找你喜欢的主题，这里以[Fan](https://github.com/fan-lv/Fan)主题为例子，点进主题之后一般会进入Github对应的主题仓库，我们直接下滑看`README`文件，上面一般给出了操作方法，而且各个主题的设置方法也基本相同

clone主题（记得`Ctrl+C`关掉hexo进程）

```bash
git clone https://github.com/fan-lv/Fan.git themes/Fan
```

修改位于博客根目录下的 `_config.yml` 内的 `theme` 选项值为 `Fan`（在尾部的位置，找不到可以`Ctrl+F`搜索）

进入`.\themes\Fan`文件夹，这里有一个`_config.yml`文件，是主题的配置文件，我们需要在这里完成大部分配置，作者贴心地给出了注释，我们只需要按照需求将对应功能的`enable`设置为`true`或者`false`，对应个人信息参数按需求修改即可。这一步不同主题配置项有很大区别，我不多加以说明，如果有疑问可以自己查询文档，部分功能如评论可能需要去配置`LeanCloud`，建议到对应的[Valine](https://valine.js.org/)项目仓库查看文档。希望大家能够自行完成，培养解决问题的能力

### 发布文章

由于是静态博客，文章编辑稍微复杂，推荐使用下载`admin`插件编辑

```bash
npm install hexo-admin --save
```

因为这个插件无法跟着上传到Github上，所以无需设置密码什么的，访问`localhost:4000/admin`即可进入管理后台，界面是英语的，但是简单熟悉后便可掌握，文章的编辑、删除等操作都可以很轻易的完成，在编辑页面右上角的锯齿图标可以设置标签和分类，其他功能可自行探索，不多赘述

编辑完成后点击`publish`发布，重新生成静态文件后即可看到文章

```bash
hexo clean
hexo g
```

### 上传 Github

1. 登录Github，新建一个仓库，注意仓库名要为`用户名.github.io`，比如我的Github ID是Chengzi600，那么仓库名为`Chengzi600.github.io`

2. 在全局配置文件中配置以下内容，repo这里改成你自己仓库的git文件

```bash
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git
  repo: https://github.com/Chengzi600/Chengzi600.github.io.git
  branch: main
```

3. 安装必要的依赖，来更加方便地部署

```bash
npm install hexo-deployer-git --save
```

4. 生成静态文件后推送，期间会弹窗让你登录，按照提示授权即可

> 如果失败了，可能是Github连接问题，建议使用梯子

> 另外还可以配置 SSH 密钥来替代弹窗登录，这里不做说明，可以自行查询

```bash
hexo c
hexo g
hexo d
```

5. 过一会儿输入你的仓库名字访问，就能发现成功上传，后续如果在本地发了新文章或做别的修改，直接重复上面的代码`hexo c hexo g hexo d`即可推送到 Github

Hexo 更多进阶功能，以后有空再更

如果你是纯萌新，没一点编程基础的，能做到这步真的很不容易了