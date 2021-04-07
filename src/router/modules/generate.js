/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const generateRouter = {
  path: '/generate',
  component: Layout,
  redirect: '/generate/project',
  name: '代码管理',
  meta: { title: '代码生成', icon: 'example', role: 'generate' },
  children: [
    {
      path: '/generate/project',
      name: '项目创建',
      component: () => import('@/views/generate/project/index'),
      meta: { title: '项目创建', icon: 'table', role: 'generate:project' }
    }
  ]
}

export default generateRouter
