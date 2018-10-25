// 全局的方法
const actions = {
  UserLogin({ commit }, data) {
    commit('LOGIN', data)
  },
  UserName({ commit }, data) {
    commit('USERNAME', data)
  },
  UserLogOut({ commit }) {
    commit('LOGOUT')
  }
}

export default actions
