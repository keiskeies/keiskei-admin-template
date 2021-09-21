/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const generateRouter = {
  path: '/log',
  component: Layout,
  redirect: '/log/operateLog',
  name: '日志管理',
  meta: { title: '日志管理', icon: 'example', role: 'log' },
  children: [
    {
      path: '/log/operateLog',
      name: '操作日志',
      component: () => import('@/views/log/operateLog/index'),
      meta: { title: '操作日志', icon: 'table', role: 'log:operateLog' }
    },
    {
      path: '/log/errorLog',
      name: '错误日志',
      component: () => import('@/views/error-log/index'),
      meta: { title: '错误日志', icon: 'table' }
    }
  ]
}

export default generateRouter
