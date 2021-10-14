import { login, getInfo, logout } from '@/api/user'
import { removeToken, cleanToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  id: undefined,
  username: '',
  name: '',
  avatar: '',
  phone: '',
  email: '',
  roles: [],
  routers: [],
  permissions: []
}

const mutations = {
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        resolve()
      }).catch(error => {
        commit('SET_USERNAME', username.trim())
        reject(error)
      })
    })
  },

  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { code, data } = response
        if (code) {
          reject('Verification failed, please Login again.')
        }
        const { id, username, name, avatar, phone, email, authorities, permissions } = data
        commit('SET_ID', id)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_PHONE', phone)
        commit('SET_EMAIL', email)
        commit('SET_USERNAME', username)
        commit('SET_ROLES', authorities)
        commit('SET_PERMISSIONS', permissions)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

