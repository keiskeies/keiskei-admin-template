/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const contentRouter = {
  path: '/content',
  component: Layout,
  redirect: '/content/page/article',
  name: '内容管理',
  meta: { title: '内容管理', icon: 'example', role: 'info' },
  children: [
    {
      path: '/content/page',
      component: () => import('@/views/content/page/article/index'),
      redirect: '/content/page/article',
      name: '页面内容',
      meta: { title: '页面内容', icon: 'table', role: 'content:page' },
      children: [
        {
          path: '/content/page/article',
          name: '科技资讯',
          component: () => import('@/views/content/page/article/index'),
          meta: { title: '科技资讯', icon: 'table', role: 'content:page:article' }
        },
        {
          path: '/content/page/conf',
          name: '会议管理',
          component: () => import('@/views/content/page/conf/index'),
          meta: { title: '会议管理', icon: 'table', role: 'content:page:conf' }
        },
        {
          path: '/content/page/dataset',
          name: '数据集',
          component: () => import('@/views/content/page/dataset/index'),
          meta: { title: '数据集', icon: 'table', role: 'content:page:dataset' }
        },
        {
          path: '/content/page/topic',
          name: 'Topic',
          component: () => import('@/views/content/page/topic/index'),
          meta: { title: 'Topic', icon: 'table', role: 'content:page:topic' }
        }
      ]
    },
    {
      path: '/content/tagInfo',
      name: '标签管理',
      component: () => import('@/views/content/tagInfo/index'),
      meta: { title: '标签管理', icon: 'table', role: 'content:tagInfo' }
    }
  ]
}

export default contentRouter
