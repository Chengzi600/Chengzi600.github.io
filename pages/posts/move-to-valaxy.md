---
title: 将博客从 Hexo 迁移到 Valaxy 教程
tags:
  - hexo
  - valaxy
  - 教程
categories:
  - 编程
  - Web
date: 2025-07-17 21:00:00
updated: 2025-07-17 21:00:00
---

::: tip

这篇教程同样适合初次建立 Valaxy 博客的朋友。只需跳过有关迁移的步骤即可。安装、配置、上传 Github 等操作都是一致的。

:::

## 我为什么要迁移

在过去的一年里，我的博客一直采用 [Hexo 博客框架](https://hexo.io/) + [hexo-theme-yun 主题](https://github.com/YunYouJun/hexo-theme-yun) + [Twikoo 评论系统](https://twikoo.js.org/) 的架构。我对这个博客最满意的地方就是它的主题，然而，该主题的作者 yunyoujun 着手开发于新的博客框架——基于 Vue 的 Valaxy，因而停止了对 hexo 主题 yun 的维护。主题便是促使我迁移的一大因素。  

此外，当时建博客时比较匆忙，很多系统如 RSS、搜索都没有来得及完善。后来我忙于备战中考，博客也被我暂时搁置了。今年年初寒假也有迁移的想法，但害怕框架还不成熟，就放弃了。现在借此机会，决定将博客整个迁移到 Valaxy。 

如果你对插件生态依赖不大，并且觉得 Valaxy 的一些特性（见[文档](https://valaxy.site/)）是你的刚需，那么可以考虑进行迁移。

<!-- more -->

## 迁移准备

迁移本身不需要做过多准备，因为只需要把 Valaxy 那边配置好了，把文章迁过去即可。全过程**不会对现有数据造成损伤**。

### 环境部署 

> 💻我的搭建环境：Windows 10, （旧）Node.js v18.19.0, （新）Node.js v20.19.0, nvm 1.2.2

1. Windows 系统需要安装 Windows Terminal 改善体验。我在之前 [部署 Hexo](https://blog.zhaozilin.cn/posts/hexo) 已经安装过了。

2. 项目需求的 Node 最低版本为`v20.19.0`，与我当前的版本不符，需要重新安装。为了以后能够再次启动 Hexo，这里使用 [**coreybutler/nvm-windows** ](https://github.com/coreybutler/nvm-windows/)项目，来支持 Node 版本的切换。根据项目提示，卸载当前设备上的 Node.js，如果有全局包（`npm i xxx -g`），使用下面的命令备份列表后再执行卸载，后续重装对应版本后，可以对照重新安装。 

```bash
# 生成全局包清单
npm list -g --depth=0 > global_modules_backup.txt
```

3. 安装 nvm-windows 的最新的 Release，使用**管理员身份运行**终端，执行下面的命令，恢复原始环境以作后用。后续只需使用`nvm use [版本号]`进行 Node 版本切换。


```bash
# 换源
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/

# 安装原始的版本以支持 Hexo
nvm install 18.19.0
nvm use 18.19.0

# 重新安装全局工具（根据列表）
npm install -g hexo-cli@4.3.1 pnpm@8.15.3

# 验证安装
hexo -v
pnpm -v

# 安装 22.12.0 版本（新项目所需）
nvm install 22.12.0

# 切换到新版本
nvm use 22.12.0
```

4. 必须安装 [VS Code](https://code.visualstudio.com/) ，后续配置过程需要用的基于它的 Valaxy 扩展。VS Code 功能十分强大，下面的工作大部分都可在其中完成。比如，我现在正依靠它撰写这篇教程。

5. 安装[ Git ](https://git-scm.com/)版本控制软件，为推送 Github 做准备。

## 部署 Valaxy
1. 选择一个合适的目录，打开终端。输入下面的命令，期间按照提示操作，使用上下方向键切换选项。注意`Select Type`选择`Blog`，`Choose the agent`选择`pnpm`，其它按需填写或选择。之后便会进入漫长的下载过程。
```bash
npm i -g pnpm
pnpm create valaxy
```

2. 不出意外的话，经过等待，服务器启动成功，按`R`重启服务器，按`O`打开页面，打开页面，稍作等待，看到主页，你便完成了初步部署。
![2025071701.png](https://s2.loli.net/2025/07/17/pXOigew7kxfRNyC.png)

> 使用 `Ctrl + C` 关闭服务器，`pnpm dev` 再次启动


## 配置 Valaxy
::: tip

这一部分内容比较复杂，可能出现一些问题，我遇见所有的问题会放置在后面的**常见问题**，如有需要可以跳跃查看。如果没有对应的解决方案，请尽可能通过日志、F12 控制台的错误信息判断原因。如果问题难以排除，可以在下面评论或前往项目的 Github Discussion 求助。

:::

### 文章
首先，根据文档，完成初步文章的转移：  
Hexo 博客目录与 Valaxy 博客目录对应关系如下，将相关内容复制至对应文件夹即可。

> 譬如**迁移文章**，即将 Hexo `source/_posts` 目录下内容复制至 Valaxy `pages/posts` 目录下。

|用途|Hexo|Valaxy|
|---|---|---|
|文章（Markdown 文件）|`source/_posts`|`pages/posts`|
|页面（Markdown / Html）|`source`|`pages`|
|静态资源（`*.js` / `*.css` / `CNAME` etc.）|`source`|`public`|

刷新页面，你应当能看到文章出现在主页，可以浏览几篇，看看是否正常。不正常的话，按下文常见问题的方案处理。

### 配置文件
确保你已经安装好 VS Code，启动 VS Code，导入你博客的目录。根据提示，安装推荐的扩展包。手动在扩展商店**安装扩展`Valaxy`**。  

如果界面为英文，点击左侧工具栏的扩展图标，搜索`Chinese`，选择简体中文语言包，点击`Install`安装，完成后重启。  

Valaxy 目录层级比较复杂，但你需要触及的，无非就是下面这些：
- `valaxy.config.ts` - 博客核心配置，如主题、导航、页脚、插件
- `site.config.ts` - 配置大部分站点信息和页面功能
- `./pages/` - 页面
- `./pages/posts/` - 你的文章

在 VS Code 中，编辑上述的两个配置文件，将鼠标悬浮在配置项上，能够看到对应配置的注释。配置项不会全部列出在默认配置文件中，如果不想对照文档一一添加配置项，可以先照抄我的配置文件，再进行修改：

```ts [valaxy.config.ts]
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonTwikoo } from 'valaxy-addon-twikoo'
import { addonComponents } from 'valaxy-addon-components'

const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '橙の小站',
    },

    nav:[
      {
        text: '分类',
        link: '/categories/',
        icon: 'i-ri-apps-line',
      },
      {
        text: '标签',
        link: '/tags/',
        icon: 'i-ri-bookmark-3-line',
      },
      {
        text: '友链',
        link: '/links/',
        icon: 'i-ri-open-arm-line',
      },
    ],
    

    pages: [
      {
        name: '分类',
        url: '/categories/',
        icon: 'i-ri-apps-line',
        color: 'dodgerblue',
      },
      {
        name: '标签',
        url: '/tags/',
        icon: 'i-ri-bookmark-3-line',
        color: 'dodgerblue',
      },
      {
        name: '友链',
        url: '/links/',
        icon: 'i-ri-open-arm-line',
        color: 'hotpink',
      },
      {
        // 默认没有这个页面，需要`pages`下创建目录，并在目录下添加`index.md`文章
        name: '感情',
        url: '/girls/',
        icon: 'i-ri-heart-3-line',
        color: 'hotpink',
      },
    ],

    footer: {
      since: 2019,
      beian: {
        enable: true,
        icp: 'xICP备xxxxxx号',
      },
    },
  },
    addons: [ // 此为插件配置，需要参照官方文档，安装对应插件后方可使用

      addonTwikoo({
        // Twikoo 评论系统
      envId: 'xxx',
    }),
      addonComponents(),// 基本组件
    ],

    

  unocss: { safelist },
})

```

```ts [site.config.ts]
import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://blog.zhaozilin.cn',
  favicon: "/yun.svg",
  lang: 'zh-CN',
  title: '橙の小站',
  subtitle: 'An infinite universe...',
  author: {
    name: 'Chengzi600',
    avatar: 'https://thirdqq.qlogo.cn/g?b=sdk&nk=2752718571&s=640',
    status: {
      emoji: '💛'
    },
  },
  description: '想要成为一个有趣的人ヾ(^∀^)ﾉ',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      // Valaxy 内置一套 ICON：https://icones.js.org/collection/ri
      // 使用 i-ri-[图标名称] 调用

      color: 'orange', 
      //`npm run rss`手动生成 RSS
      //自动生成参见：https://valaxy.site/guide/config/extend#rss
    },
    {
      name: 'QQ',
      link: 'https://qm.qq.com/q/2xQ040ssFK',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'QQ 群',
      link: 'https://qm.qq.com/cgi-bin/qm/qr?k=JZCUQmZXUfkkOZI26nmGd5euc45NUIxQ&jump_from=webapi&authKey=OscGZ0B3mzzLeiow0PCxk2ItKVKRwLMrWiWSGGhEcy7w0JjBrUrNu4D+wvcq5IhA',
      icon: 'i-ri-qq-line',
      color: '#23c21eff',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/Chengzi600',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/361273232',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: 'E-Mail',
      link: '2752718571@qq.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  redirects: {
    // Valaxy 采用文章文件名作为导航，不支持 Hexo 的日期层级和指定 ID
    // 为了防止访客进入以前网址导致 404，可以添加重定向
    useVueRouter: false,
    rules: [
      {
        from: '/posts/38835.html',
        to: '/posts/godot',
      },
    ]
  },

  search: {
    // 本地搜索：https://valaxy.site/guide/third-party#%E6%90%9C%E7%B4%A2
    enable: true,
    type: 'fuse',
  },

  comment: {
    // 评论系统：https://valaxy.site/guide/third-party/comment-system
    // 下文以 Twikoo 为例详细说明
    enable: true,
  },

  license: {
    // 结尾版权许可证信息
    enabled: false,
    },

  statistics: {
    // 阅读时间
      enable: true,
      readTime: {
        speed: {
          cn: 300,
          en: 200,
        },
      },
    },

   sponsor: {
    // 赞助
    enable: false,
    title: '我很可爱，请给我钱！',
    methods: [
      {
        name: '支付宝',
        url: '',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: 'QQ 支付',
        url: '',
        color: '#12B7F5',
        icon: 'i-ri-qq-line',
      },
      {
        name: '微信支付',
        url: '',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
    encrypt: {
      // 文章加密：https://valaxy.site/guide/page#%E9%A1%B5%E9%9D%A2%E5%8A%A0%E5%AF%86
     enable: true,
      }
})
```

关于基础信息以外的扩展配置，已在配置文件中用注释的形式标出对应文档。如果还不能理解或有其他个性化需求，请前往文档查阅。

### Twikoo 评论系统迁移

如果你还没有部署评论系统，请遵循[ Twikoo 文档](https://twikoo.js.org/)指引一步步搭建。完成之后，根据文档提示，复制好你的**环境 ID**备用。

如果你迁移自其它评论系统，仔细阅读[第三方评论系统](https://valaxy.site/guide/third-party/comment-system)、[Valaxy 插件橱窗](https://valaxy.site/addons/gallery)文档后，再参考下面流程完成迁移。

#### 安装 Twikoo 评论插件
> https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-addon-twikoo
1. 使用 npm 或 pnpm 安装插件
```bash
npm i valaxy-addon-twikoo
```
2. 参照下面内容，修改配置文件，开启评论系统。  
如果你使用了上文我给你的配置文件，那么插件已经启用，只需要在预留给你的位置输入环境 ID 即可完成安装。
```ts
// valaxy.config.ts & site.config.ts
import { defineValaxyConfig } from 'valaxy'
import { addonTwikoo } from 'valaxy-addon-twikoo'

export default defineValaxyConfig({
  siteConfig: {
    // 启用评论，这部分添加在 site.config.ts
    comment: {
      enable: true
    },
  },
  // 设置 valaxy-addon-twikoo 配置项，在 valaxy.config.ts 末端
  addons: [
    addonTwikoo({
        envId: 'xxx', // 环境 ID
    }),
  ],
})
```

3. 控制台按`R`，进入文章，查看评论系统是否工作正常。尝试登录管理面板、并发送一条评论测试。

#### 迁移评论信息

Valaxy 采用`posts`下的文件名作为文章链接，与 Hexo 用发布日期文件夹作为链接存在差异。迁移后导致先前链接 404 的问题，可在配置文件中设置重定向。（已在上文配置文件中提供示例） 

但是来自评论系统不会遵循你的重定向规则，因此需要手动把评论迁移到新页面。

1. 打开 Twikoo 管理面板，点击导出，将评论信息导出为 JSON 文件
2. 使用编辑器打开 JSON 文件，大概格式像这样：
```json [twikoo-comment.json]
[
  {
    "_id": "xxx",
    "uid": "xxx",
    "nick": "Chengzi600",
    "mail": "2752718571@qq.com",
    "mailMd5": "a9f4c9ce38ea31cc308f146883cee8ce104c4c9f67163663aa85e5bbde359d75",
    "link": "12e",
    "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0",
    "ip": "",
    "master": false,
    "url": "/posts/38835.html", // [!code warning]
    "href": "http://localhost:4000/posts/38835.html", // [!code warning]
    "comment": "<p>测试</p>\n",
    "pid": null,
    "rid": null,
    "isSpam": false,
    "created": 1752578621427,
    "updated": 1752578621427
  },
  // ...
]
```
3. 使用查找替换功能，将原来的url后面文章链接的部分更新。 
如将`/posts/38835.html`替换`/posts/godot`

::: tip

针对文章较多的博客，该方法可能比较复杂。可以完成重定向配置后，写脚本解决问题。如果先前文章链接不带`.html`，可以尝试按照原来目录格式新建文件夹，并放置文章。

:::

4. 确保所有评论的地址都替换为新的之后，保存文件。回到管理面板，点击导入。源系统选择`Twikoo(JSON)`，再选中修改好的文件，确认操作。刷新页面，即可发现之前的评论都迁移过来了。

::: warning

回复可能需要更新对应数据中的父评论信息，也可以手动补档

:::

## 上传到 Github Pages

> https://valaxy.site/guide/deploy

与 Hexo 本地部署后再推送不同，Valaxy 采用更便捷的云端（Github Action）部署。在开始之前，可先本地部署，看看有没有报错。
```bash
# 执行 build 命令构建，dist 文件夹为构建后的内容
pnpm run build
```

### 清空先前仓库

Github Pages 要求以`[用户名].github.io`为仓库名。如果之前已经部署过，需要先清空仓库。如果你还没推送过 Github，可按要求创建一个空的`Public`仓库，然后略过这一过程。

> 按文档完成仓库配置  
>
> - 选择 Github Repo，打开 **Settings-> Action -> General -> Workflow permissions，选择 read and write permissions**。

1. 本地创建空文件夹，运行下面代码，拉取仓库。如果初次使用，按报错中的要求设定用户名、E-Mail。请把代码中的地址改为自己的仓库。

```bash
git pull https://github.com/Chengzi600/Chengzi600.github.io.git
```

2. 删除拉取的所有文件，并执行：

```bash
git add -u
git commit -m "chore: clean-up"

git remote add origin https://github.com/Chengzi600/Chengzi600.github.io.git
git push origin main
```
::: warning

如果提示登录，请积极配合。如果遇到网络问题，请使用代理工具，并进行设置（Clash 为例）：
```bash
# 设置HTTP/HTTPS代理（根据HTTP代理端口填写，Clash为7890）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

:::

### 推送
确认仓库为空，返回到博客目录。Valaxy 已经内置了`.gitignore`文件声明哪些不会被推送，不要修改。请留意远端仓库主分支名称，如果与本地不符，请修改，默认为`main`。
```bash
git init
git remote add origin https://github.com/Chengzi600/Chengzi600.github.io.git

git add -u
git commit -m "feat: start valaxy project"

git push origin main
```
Action 流程将自动执行，完成后，打开 **Settings -> Pages**，选择 `gh-pages` 分支。

如果需要自定义域名，参照 Github Pages 的通用文档设置，然后将`CNAME`文件放置在`public`目录下，并执行提交、推送。

访问`[用户名].github.io`，**Enjoy it** !

## 常见问题
### Q: 迁移后，截断异常，主页不显示文章预览内容
规范在截断处添加截断符，不要遗漏`more`前后的空格。
```md

<!-- more -->

```
### Q: 文章修改日期异常
在 frontmatter 添加`updated`字段。
```
---
title: 将博客从 Hexo 迁移到 Valaxy 教程
tags:
  - hexo
  - valaxy
  - 教程
categories:
  - 编程
  - Web
date: 2025-07-17 21:00:00
updated: 2025-07-17 21:00:00 // [!code warning]
---
```
### Q: 文章加密异常
> Valaxy 还支持部分加密，可查阅[内容加密](https://valaxy.site/guide/config#%E5%86%85%E5%AE%B9%E5%8A%A0%E5%AF%86)

先开启加密功能。
```ts [site.config.ts]
import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  encrypt: {
    // 开启加密，默认关闭
    enable: true
    // algorithm
    // iv
    // salt
  }
})
```

替换 frontmatter，删除原来 Hexo 的加密字段，新添加`password`字段即可。

> 更多问题可在评论区反馈  
> To Be Continued...

## 尾声

至此，搭建和迁移工作全面完成，后续大部分时间只需在`posts`文件夹下写文章，然后重复提交、推送的流程。

有关扩展组件，如访问计数、自定义页尾、友链、自定义页面等，可以参照文档搭建，也可以在下方评论，我会视情况追加内容的。