/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const emailRouter = {
  path: '/email',
  component: Layout,
  redirect: '/email/pushTask',
  name: '邮件推送',
  meta: { title: '邮件推送', icon: 'example', role: 'email' },
  children: [
    {
      path: '/email/pushTask',
      name: '推送任务',
      component: () => import('@/views/email/pushTask/index'),
      meta: { title: '推送任务', icon: 'table', role: 'email:pushTask' }
    },
    {
      path: '/email/pushTemplate',
      name: '推送模版',
      component: () => import('@/views/email/pushTemplate/index'),
      meta: { title: '推送模版', icon: 'table', role: 'email:pushTask' }
    },
    {
      path: '/email/pushRecord',
      name: '推送记录',
      component: () => import('@/views/email/pushRecord/index'),
      meta: { title: '推送记录', icon: 'table', role: 'email:pushRecord' }
    }
  ]
}

export default emailRouter
