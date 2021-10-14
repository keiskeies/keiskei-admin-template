import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (store.getters.id === -1 || store.getters.id === '000000000000000000000000') {
    return true
  }
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    return roles.some(role => {
      return permissionRoles.includes(role)
    })
    // eslint-disable-next-line no-unreachable
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
