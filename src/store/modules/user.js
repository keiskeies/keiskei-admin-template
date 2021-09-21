import { login, getInfo } from '@/api/user'
// import { getDataDict as getDataDictionaryOptions } from '@/api/common'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  id: undefined,
  token: getToken(),
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
        const { data } = response
        setToken(data.token)
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
        // getDataDictionaryOptions().then(res => {
        //   localStorage.setItem('allOptions', JSON.stringify(res.data))
        // })
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_ID', '')
      commit('SET_NAME', '')
      commit('SET_AVATAR', '')
      commit('SET_PHONE', '')
      commit('SET_EMAIL', '')
      commit('SET_USERNAME', '')
      commit('SET_ROLES', '')
      commit('SET_PERMISSIONS', '')
      removeToken()
      resetRouter()
      resolve()
    })
  },
  refuseToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      const token = getToken()
      if (token) {
        axios.get(process.env.VUE_APP_BASE_API + '/security/self/token', {
          headers: { 'Access-Token': token }
        }).then(response => {
          const res = response.data
          if (res.status !== 200) {
            commit('SET_ID', '')
            commit('SET_NAME', null)
            removeToken()
            resetRouter()
          } else {
            const { data } = response
            commit('SET_TOKEN', data)
            setToken(data)
            resolve()
          }
        })
      } else {
        commit('SET_ID', '')
        commit('SET_NAME', null)
        removeToken()
        resetRouter()
        resolve()
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

