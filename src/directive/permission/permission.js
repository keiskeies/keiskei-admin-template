import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    if (store.getters.id !== -1) {
      const { value } = binding
      const roles = store.getters && store.getters.permissions // 之前是根据role做判断,现在修改role字段为permissions,其他逻辑不变

      if (value && value instanceof Array && value.length > 0) {
        const permissionRoles = value

        const hasPermission = roles.some(role => {
          return permissionRoles.includes(role)
        })

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        throw new Error(`need roles! Like v-permission="['admin','editor']"`)
      }
    }
  },
  check(val) {
    if (store.getters.id === -1) {
      return true
    }
    const roles = store.getters && store.getters.permissions // 之前是根据role做判断,现在修改role字段为permissions,其他逻辑不变
    return roles.some(role => {
      return val.includes(role)
    })
  }
}
