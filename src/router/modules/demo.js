/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const demoRouter = {
  path: '/demo',
  component: Layout,
  redirect: '/demo/demo',
  name: '测试',
  meta: {title: '测试', icon: 'example', role: 'demo'},
  children: [
    {
      path: '/demo/demo',
      name: '表单测试',
      component: () => import('@/views/demo/demo/index'),
      meta: {title: '表单测试', icon: 'table', role: 'demo:demo'}
    },
  ]
}

export default demoRouter
