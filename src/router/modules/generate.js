/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const generateRouter = {
  path: '/generate',
  component: Layout,
  redirect: '/generate/project',
  name: '代码管理',
  meta: { title: '代码管理', icon: 'example', role: 'generate' },
  children: [
    {
      path: '/generate/project',
      name: '项目管理',
      component: () => import('@/views/generate/project/index'),
      meta: { title: '项目管理', icon: 'table', role: 'generate:project' }
    },
    {
      path: '/generate/project/add',
      name: '项目创建',
      component: () => import('@/views/generate/project/edit'),
      meta: { title: '项目创建', icon: 'table', role: 'generate:project:add' },
    },
    {
      path: '/generate/project/edit',
      name: '项目创编辑',
      component: () => import('@/views/generate/project/edit'),
      meta: { title: '项目编辑', icon: 'table', role: 'generate:project:edit' },
      hidden: true
    }
  ]
}

export default generateRouter
