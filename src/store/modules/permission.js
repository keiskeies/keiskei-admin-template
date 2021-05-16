import { asyncRoutes, constantRoutes } from '@/router'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.includes(route.meta.role)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 * @param commit
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
export function filterAsyncPermissionPath(routes) {
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      filterAsyncPermissionPath(tmp.children)
    }
    permissionUrls.push(tmp.path)
    permissionUrls.push(tmp.redirect)
  })
}
const permissionUrls = []

export function filterAsyncAllPath(routes) {
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      filterAsyncAllPath(tmp.children)
    }
    allUrls.push(tmp.path)
    allUrls.push(tmp.redirect)
  })
}
const allUrls = []

const state = {
  routes: [],
  addRoutes: [],
  allUrls: [],
  permissionUrls: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSION_URLS: (state, urls) => {
    state.permissionUrls = urls
  },
  SET_ALL_URLS: (state, urls) => {
    state.allUrls = urls
  }
}

const actions = {
  generateRoutes({ commit }, {permissions, authorities}) {
    return new Promise(resolve => {
      let accessedRoutes
      if (authorities.some(e => e.id === -1)) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
      }
      filterAsyncPermissionPath(accessedRoutes)
      filterAsyncPermissionPath(constantRoutes)
      filterAsyncAllPath(asyncRoutes)
      filterAsyncAllPath(constantRoutes)
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_PERMISSION_URLS', Array.from(new Set(permissionUrls)))
      commit('SET_ALL_URLS', Array.from(new Set(allUrls)))
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
