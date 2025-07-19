---
title: 图寻复盘助手的开发 - 利用浏览器脚本劫持 XHR 请求的基本方法
tags:
  - 油猴
  - 脚本
  - 游戏
categories:
  - 编程
  - Web
date: 2025-07-19 16:00:00
updated: 2025-07-19 16:00:00
---

## 前言

[图寻](https://tuxun.fun/)是一款通过现实全景图来猜测位置的娱乐化学习应用。类似于国外的 [GeoGuessr](https://www.geoguessr.com/)，你可以通过观察街景进行判断，通过点击地图得分。它使用的街景车全景，主要来自百度、腾讯、谷歌三家提供商。

本文将制作能够解析来自图寻服务端响应的**图寻复盘助手**，借此探讨使用浏览器扩展或脚本拦截请求（Fetch）的基本方法。从控制台网络抓包起步，到编写自动化解析请求/响应信息的浏览器脚本。

<!-- more -->

## 准备工作
> 💻我的开发环境：Windows 10, Chrome 138.0.0.0

1. 安装 [Tampermonkey](https://www.tampermonkey.net/#) 浏览器扩展。

2. 注册[百度开放平台](https://lbsyun.baidu.com/apiconsole/key)，完成个人实名认证，申请 AK (API Key)，应用类型为浏览器端，IP白名单填写`*`。

## 研究
::: warning

请勿滥用。在图寻中的匹配/积分赛中启用脚本，可能被永久封禁。

:::

访问图寻，使用`F12`开启浏览器开发者面板，切换到网络选项卡。随便进入一局单人游戏，完成抓包工作。

![2025071903.png](https://s2.loli.net/2025/07/19/b3CewMHJUyVkIZ6.png)


筛选`Fetch/XHR`，浏览抓到的请求，其中：
- `getSelfProfile` 获取玩家的个人信息，如果在多人比赛对局内，则为所有场上玩家的信息。
- `listEmojis` 玩家对局中可用的表情包列表。
- `join?` `get?` 则为对局基本信息。

重点在于`getPanoInfo?`这一请求，它的请求地址为图寻的 API，但是竟然能够得到包括具体经纬度的响应。

![2025071902.png](https://s2.loli.net/2025/07/19/bVmH2UjJOYNdikP.png)

我们来看一看这样的响应包含了多少信息：

```json
{
    "success": true,
    "data": {
        "fov": null,
        "lat": 41.20634678633731, // WGS84 坐标系
        "lng": 123.20092025890284,
        "bd09Lat": 41.212183, // 百度坐标系
        "bd09Lng": 123.207489,
        "pano": "09011100011605101534289442L",// 街景 ID
        "centerHeading": 82.52000000000001,// 朝向
        "height": null,
        "width": null,
        "links": [ // 周边街景点
            {
                "pano": "09011100011605101534260722L",
                "heading": 353.647909642982,
                "centerHeading": 83.72999999999999
            },
            {
                "pano": "09011100011605101532194292L",
                "heading": 288.20622437119687,
                "centerHeading": 349.13
            },
            {
                "pano": "09011100011605101532237942L",
                "heading": 11.61148642388849,
                "centerHeading": 2.480000000000004
            },
            {
                "pano": "09011100011605101534308772L",
                "heading": 173.50419815458238,
                "centerHeading": 84.58000000000001
            }
        ]
    },
    "hintCode": null,
    "hintMessage": null
}
```

图寻为何要将包含答案的响应发送给客户端，我们无从得知。事实上，已经有很多人向图寻汇报了这一问题，可官方宁愿在排位赛中加强对插件的监控，也不愿意修复这一问题。

进一步深入探究发现，提交答案时，包含用户选择经纬度的请求被发送到服务器，服务器验证答案后返回结果。答案的验证是在服务器上进行的，没必要把答案发送到客户端。

可能的解释是，街景块是直接从百度地图服务器发送到用户的，而不经过图寻服务器或其 CDN 中转，其中包街景 ID 的数据，不需要刻意隐藏。然而，谷歌街景即使通过中转，也没有被抹去经纬度信息。

## 实现
通过研究，我们发现街景的详细信息已经发送给玩家了。那么只需要截获对应的响应信息，就可以在复盘时得到经纬度，进而运用地图 API 的逆地理编码功能解析可读的地址。

> 完整 Demo：https://greasyfork.org/zh-CN/scripts/541918


> 碎碎念：由于一时疏忽，支持从 API 获取 POI 信息、支持谷歌街景国家大区解析的 Demo 被意外删除，无法找回... 此版本能够正常解析百度、腾讯两家街景的经纬度、周边街景、省市区信息，无法解析谷歌街景。


### 劫持

通过重写`XMLHttpRequest`来拦截请求、响应信息，然后使用`return originalOpen.apply(this, arguments);`放行。

```js
// UI 代码已除去，仅保留核心逻辑

(function() {
    'use strict';

    // 调试模式开关
    const DEBUG_MODE = true;
    const OriginalXHR = window.XMLHttpRequest;
    
    // 日志函数
    function log(...args) {
        if (DEBUG_MODE) {
            console.log('[图寻小助手-Log]', ...args);
        }
    }

     // 重写 XMLHttpRequest 以拦截请求
    window.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();

        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        xhr.open = function(method, url) {
            log('拦截到XHR请求:', url);
            this._url = url;

            return originalOpen.apply(this, arguments);
        };

        xhr.send = function() {
            xhr.addEventListener('load', () => {
                const url = this._url;

                // 这里通过游戏中不同街景时的抓包，获取相应 API 地址，然后再此处判断
                const baiduPanoRegex = /https:\/\/tuxun\.fun\/api\/v0\/tuxun\/mapProxy\/getPanoInfo/;
                const tencentPanoRegex = /https:\/\/tuxun\.fun\/api\/v0\/tuxun\/mapProxy\/getQQPanoInfo/;
                const googlePanoRegex = /https:\/\/tile\.chao-fan\.com\/\$rpc\/google\.internal\.maps\.mapsjs\.v1\.MapsJsInternalService\/GetMetadata/;

                // 转给解析函数负责
                if (baiduPanoRegex.test(url)) {
                    log('检测到百度街景getPanoInfo XHR请求');
                    handleXHRPanoResponse(xhr, 'baidu');
                } else if (tencentPanoRegex.test(url)) {
                    log('检测到腾讯街景getQQPanoInfo XHR请求');
                    handleXHRPanoResponse(xhr, 'tencent');
                } else if (googlePanoRegex.test(url)) {
                    log('检测到谷歌街景XHR请求');
                    handleXHRPanoResponse(xhr, 'google');
                }
            });

            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    // 处理XHR街景响应
    function handleXHRPanoResponse(xhr, mapType) {
        const urlObj = new URL(xhr._url);
        let panoId = '';

        if (mapType === 'baidu' || mapType === 'tencent') {
            panoId = urlObj.searchParams.get('pano');
        } else if (mapType === 'google') {
            // 谷歌街景的响应非常无序复杂，需要正则表达式判断，暂时不做
            panoId = '无';
        }

        log(`${mapType === 'baidu' ? '百度' : mapType === 'tencent' ? '腾讯' : '未知'}街景XHR请求的Pano ID:`, panoId);

        try {
            // 解析响应
            const responseText = xhr.responseText;

            let jsonData;
            try {
                jsonData = JSON.parse(responseText);

                log(`${mapType === 'baidu' ? '百度' : mapType === 'tencent' ? '腾讯' : '谷歌'}街景XHR响应JSON:`, jsonData);
            } catch (parseError) {
                // 不是JSON格式，则一定是谷歌
                log(`谷歌响应JSON:`, jsonData);
            }
        }
         catch (error) {
            error('处理XHR请求出错:', error);
        }
    }
})();
```

### 利用百度 API 解析

通过百度 API 提供的坐标转换、逆地理编码功能。完成从经纬度到地址的解析。

```js
const BAIDU_AK = '';// AK

function fetchLocationInfo(lat, lng) {

    if (window.BMap) {
        doGeocode(lat, lng);
        return;
    }

    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${BAIDU_AK}&callback=initBaiduMap`;
    script.type = 'text/javascript';
    document.head.appendChild(script);
    window.initBaiduMap = function() {
        doGeocode(lat, lng);
    };

    // 超时处理
    setTimeout(() => {
        if (!window.BMap) {
            error("百度 API 超时");
    }, 5000);
}

// 执行逆地理编码
function doGeocode(lat, lng) {
    const locationInfo = document.getElementById('tuxun-location-info');
    const locationStatus = document.getElementById('tuxun-location-status');

    try {
        const point = new BMap.Point(lng, lat);
        const convertor = new BMap.Convertor();
        const points = [point];
        // 后续如果要支持谷歌街景，会发现谷歌街景没有百度坐标系。所以这里使用 BGS 坐标系转换为百度坐标系，而不是直接使用响应信息中的百度坐标系

        convertor.translate(points, 1, 5, (data) => {
            if (data.status === 0) {
                const bdPoint = data.points[0];
                const geoc = new BMap.Geocoder();
                geoc.getLocation(bdPoint, (rs) => {
                    const address = rs.addressComponents;
                    log(address);
                });
            } else {
                throw new Error('坐标转换失败:' + data.status);
            }
        });
    } catch (error) {
        error('位置解析失败:', error);
    }
}
```

## 写在最后

文章中拦截 XML 请求的方法具有广泛适用性。Fetch 请求本文虽没有涉及，但是基本思路一致，即**重写对应方法，拦截并储存请求数据，然后二次放行**。拿到响应的 JSON 数据后，就可以根据项目需求进行对应的解析。


