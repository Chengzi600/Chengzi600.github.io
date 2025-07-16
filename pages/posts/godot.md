---
title: 恶魔轮盘赌拆包 - Godot 引擎游戏的逆向
author: Chengzi600
tags:
  - 教程
  - 游戏
categories:
  - 编程
  - 逆向
abbrlink: 38835
date: 2024-02-24 19:30:00
updated: 2024-02-24 19:30:00
---
## 前言

近期网络上也是出现了一款特别火的游戏——**Buckshot Roulette**，也叫恶魔轮盘赌，游戏玩法不多赘述，这里提供 Godot 引擎游戏逆向的一般方法，至于游戏中AI大哥的逻辑，B站上已经有了分析[# 逆向代码解析恶魔轮盘赌！你想知道的全在这里](https://www.bilibili.com/video/BV13z421R73V)

## 准备工作

游戏是 **Godot** 引擎开发的，Godot 是一个开源引擎，这意味着我们可以很容易地将其反编译，得到项目文件，以此来获得你想要的音频/图片资源，甚至对代码进行二次开发

这里我们用到 Github 上一个开源项目 [[GitHub - bruvzg/gdsdecomp: Godot reverse engineering tools](https://github.com/bruvzg/gdsdecomp)，该程序支持反编译 Godot 4.x、3.x 和 2.x 项目

<!-- more -->

1. 在 Github 下载最新的 Release，解压

2. `Buckshot Roulette.exe`游戏文件，1.0或1.1版本均可

## 逆向过程

### 获得项目文件

1. 启动`gdre_tools.exe`，选择`RE Tools`-`Recover Project`，在文件选择框中选择下载好的游戏主程序文件`Buckshot Roulette.exe`，选择输出文件夹并选择`Full Project Recovery`获得完整项目文件，等待几分钟时间，程序会把整个项目文件提到你选择的文件夹中，期间程序自带的控制台可能报错，不用理会即可

2. 完成之后，点开项目文件夹，我们为了在 Godot 中打开项目，需要先看项目版本，用任意编辑器打开`project.godot`文件

   ```systemd
   [application]

   config/name="Buckshot Roulette"
   run/main_scene="res://scenes/menu.tscn"
   config/features=PackedStringArray("4.2", "Forward Plus")
   boot_splash/bg_color=Color(0, 0, 0, 1)
   boot_splash/show_image=false
   config/icon="res://misc/icon1.png"
   ```

   从中不难发现，项目所用的 Godot 版本为`4.2`，我们到 Godot 官网下载对应的版本，添加项目，选中`project.godot`文件即可加载

### 提取资源

由于大部分人不会 Godot 开发，只是想要获得游戏中的资源，这里简单说明一下资源的提取

先来观察下目录结构

```bash
┌─.assets
├─.godot
├─.idea
├─audio
├─fonts
├─GodotRetro
├─instances
├─main player
├─materials
├─misc
├─models
├─scenes
├─scripts
└─textures
```

目录结构取决于开发者的习惯，但是大多情况下，一些文件夹的命名和文件的存放原则是一致的，这里说明几个重要文件夹

- `audio`存储游戏的音频文件，游戏的音乐、音效都在这里

- `fonts`存储游戏的字体，该游戏中字体全部是特制的，如有需求可以直接安装`.ttf`文件（这游戏几套字体都只支持英文字母）

- `models` `textures`存储游戏的贴图，能从里面找到很多道具的贴图

- `scripts`存储游戏中全部代码文件，Godot 开发使用  *GDScript* 脚本语言，由于 Godot 引擎的特殊性，解包出来的代码中变量名和方法名没有任何变化，甚至注释都完整保留，具有极强的可读性

  我们可以从代码中看出作者对引擎功能的不满以及恶趣味，遗憾的是计算奖金的这个彩蛋没有保留下来

  ```gdscript
  # HealthCounter.gd

  # Why can I not add functions with arguments into godot animator :sob:
  ```

  ```gdscript
  # EndingManager.gd

  if (endless_overwriting): total_cash = endless_score
  # if (playername == "sex"): total_cash = 69
  # if (playername == "leet"): total_cash = 1337
  # if (playername == "snoop" or playername == "weed" or playername == "kush"): total_cash = 420
  ```

特殊说明，`.import`文件是 Godot 引擎的导入记录，与资源内容无关，可以直接无视

根据目录的结构，我们可以针对性浏览文件，从而轻易地找到自己想要的东西

## 尾声

由于我并不熟悉 Godot 的开发，文章中的介绍可能有所欠缺，有错误还麻烦在底下评论指正，而且我的设备太烂，Godot 引擎都跑不起来...

由此可见，Godot 的逆向非常容易，也非常容易被人拿来干坏事，**开源是把双刃剑**，我们都应该合理地运用它
