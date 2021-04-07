/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  name: '系统设置',
  meta: { title: '系统设置', icon: 'example', role: 'system' },
  children: [
    {
      path: '/system/user',
      name: '管理员',
      component: () => import('@/views/system/user/index'),
      meta: { title: '管理员', icon: 'table', role: 'system:user' }
    },
    {
      path: '/system/role',
      name: '角色管理',
      component: () => import('@/views/system/role/index'),
      meta: { title: '角色管理', icon: 'table', role: 'system:role' }
    },
    {
      path: '/system/permission',
      name: '权限管理',
      component: () => import('@/views/system/permission/index'),
      meta: { title: '权限管理', icon: 'tree', role: 'system:permission' }
    },
    {
      path: '/system/department',
      name: '部门管理',
      component: () => import('@/views/system/department/index'),
      meta: { title: '部门管理', icon: 'tree', role: 'system:department' }
    },
    {
      path: '/system/scheduledTask',
      name: '定时任务',
      component: () => import('@/views/system/scheduledTask/index'),
      meta: { title: '定时任务', icon: 'tree', role: 'system:scheduledTask' }
    },
    {
      path: '/system/dictionary',
      name: '数据字典',
      component: () => import('@/views/system/dictionary/index'),
      meta: { title: '数据字典', icon: 'tree', role: 'system:dictionary' }
    }
  ]
}

export default systemRouter
