const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  introduction: state => state.user.introduction,
  permission_routes: state => state.permission.routes,
  permission_urls: state => state.permission.permissionUrls,
  all_urls: state => state.permission.allUrls,
  errorLogs: state => state.errorLog.logs,

  id: state => state.user.id,
  avatar: state => state.user.avatar,
  phone: state => state.user.phone,
  email: state => state.user.email,
  name: state => state.user.name,
  username: state => state.user.username,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions
}
export default getters
