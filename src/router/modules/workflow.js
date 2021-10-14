/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const workflowRouter = {
  path: '/workflow',
  component: Layout,
  redirect: '/workflow/issue',
  name: '工作流',
  meta: { title: '工作流', icon: 'example', role: 'workflow' },
  children: [
    {
      path: '/workflow/issue',
      name: '卡片管理',
      component: () => import('@/views/workflow/issue/index'),
      meta: { title: '卡片管理', icon: 'table', role: 'workflow:issue' }
    },
    {
      path: '/workflow/issuePlan',
      name: '卡片计划',
      component: () => import('@/views/workflow/issuePlan/index'),
      meta: { title: '卡片计划', icon: 'table', role: 'workflow:issuePlan' }
    },
    {
      path: '/workflow/issueReview',
      name: '卡片评论',
      component: () => import('@/views/workflow/issueReview/index'),
      meta: { title: '卡片评论', icon: 'table', role: 'workflow:issueReview' }
    },
    {
      path: '/workflow/issueOperateLog',
      name: '卡片操作记录',
      component: () => import('@/views/workflow/issueOperateLog/index'),
      meta: { title: '卡片操作记录', icon: 'table', role: 'workflow:issueOperateLog' }
    },
    {
      path: '/workflow/issueField',
      name: '卡片字段',
      component: () => import('@/views/workflow/issueField/index'),
      meta: { title: '卡片字段', icon: 'table', role: 'workflow:issueField' }
    },
    {
      path: '/workflow/issueType',
      name: '卡片类型',
      component: () => import('@/views/workflow/issueType/index'),
      meta: { title: '卡片类型', icon: 'table', role: 'workflow:issueType' }
    },
    {
      path: '/workflow/issueAttachment',
      name: '卡片附件',
      component: () => import('@/views/workflow/issueAttachment/index'),
      meta: { title: '卡片附件', icon: 'table', role: 'workflow:issueAttachment' }
    },
    {
      path: '/workflow/issueFieldItem',
      name: '卡片字段选项',
      component: () => import('@/views/workflow/issueFieldItem/index'),
      meta: { title: '卡片字段选项', icon: 'table', role: 'workflow:issueFieldItem' }
    },
    {
      path: '/workflow/issueFieldValue',
      name: '卡片字段值',
      component: () => import('@/views/workflow/issueFieldValue/index'),
      meta: { title: '卡片字段值', icon: 'table', role: 'workflow:issueFieldValue' }
    }
  ]
}

export default workflowRouter
