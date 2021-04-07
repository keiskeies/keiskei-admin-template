const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  introduction: state => state.user.introduction,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,

  id: state => state.user.id,
  avatar: state => state.user.avatar,
  phone: state => state.user.phone,
  email: state => state.user.email,
  realName: state => state.user.realName,
  username: state => state.user.username,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions
}
export default getters
