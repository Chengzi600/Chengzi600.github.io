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
      color: 'orange',
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
    useVueRouter: false,
    rules: [
      {
        from: '/posts/38835.html',
        to: '/posts/godot',
      },
    ]
  },

  search: {
    enable: true,
    type: 'fuse',
  },

  comment: {
    enable: true,
  },

  license: {
    enabled: false,
    },

  statistics: {
      enable: true,
      readTime: {
        speed: {
          cn: 300,
          en: 200,
        },
      },
    },

   sponsor: {
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
     enable: true,
      }
})
