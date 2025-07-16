import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonTwikoo } from 'valaxy-addon-twikoo'

// add icons what you will need
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

    pages: [
      {
        name: '友链',
        url: '/links/',
        icon: 'i-ri-open-arm-line',
        color: 'dodgerblue',
      },
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
        icp: '赣ICP备2022003307号',
      },
    },
  },
  addons: [
    addonTwikoo({
      envId: 'https://cheng-twikoo.netlify.app/.netlify/functions/twikoo',
    })
  ],

  unocss: { safelist },
})
