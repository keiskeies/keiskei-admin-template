import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/person/center'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else if (to.path === '/404' || to.path === '/401') {
      next()
    } else {
      const hasGetUserInfo = store.getters.username
      if (hasGetUserInfo) {
        gotoPermissionNext(to, next, hasGetUserInfo)
      } else {
        try {
          const { code, data } = await store.dispatch('user/getInfo')
          const { permissions, authorities } = data
          const accessRoutes = await store.dispatch('permission/generateRoutes', { permissions, authorities })
          router.options.routes = accessRoutes
          router.addRoutes(accessRoutes)
          gotoPermissionNext(to, next, false)
        } catch (error) {
          Message.error(error || 'Has Error')
          next(`/401`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      if (to.path === '/401') {
        next(`/login`)
      } else {
        next(`/login?redirect=${to.path}`)
      }
      NProgress.done()
    }
  }
})

export function gotoPermissionNext(to, next, hasGetUserInfo) {
  if (to.path.startsWith('/redirect')) {
    next()
  } else if (store.getters.all_urls.indexOf(to.path) > -1) {
    if (store.getters.permission_urls.indexOf(to.path) > -1) {
      if (hasGetUserInfo) {
        next()
      } else {
        next({ ...to, replace: true })
      }
    } else {
      next({ path: '/401' })
    }
  } else {
    next({ path: '/404' })
  }
}

router.afterEach(() => {
  NProgress.done()
})
