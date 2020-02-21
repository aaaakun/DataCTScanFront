export const strict = true

export const state = () => ({
  isMenuHidden: false,
  realm: "USAmazon",
  realms: [ "USAmazon", "EUAmazon", "JPAmazon" ],
  team: 'All',
  teams: [],
  menus: [{
    name: "DAG",
    icon: "el-icon-share",
    children: [{
      name: "Time Window",
      icon: "el-icon-share",
      url: "/timeWindow"
    },{
      name: "Data Lineage",
      icon: "el-icon-share",
      url: "/lineage"
    },{
      name: "Workflow",
      icon: "el-icon-share",
      url: "/workflow"
    }]
  }, {
    name: "Analyze",
    icon: "el-icon-share",
    children: [{
      name: "Delay History for Jobs",
      icon: "el-icon-share",
      url: "/analyze/jobs"
    },{
      name: "Single Job Analyze",
      icon: "el-icon-share",
      url: "/analyze/job"
    }]
  }]
})

export const mutations = {
  TOGGLE_MENU_HIDDEN (state) {
    state.isMenuHidden = !state.isMenuHidden;
  },
  CHANGE_REALM (state, realm) {
    state.realm = realm;
  },
  SET_TEAMS (state, teams) {
    state.teams = teams;
  },
  SET_TEAM (state, team) {
    state.team = team;
  }
}

export const getters = {
  isMenuHidden (state) {
    return state.isMenuHidden;
  },
  menus (state) {
    return state.menus;
  },
  realms (state) {
    return state.realms;
  },
  realm (state) {
    return state.realm;
  },
  teams (state) {
    return state.teams;
  },
  team (state) {
    return state.team;
  }
}

export const actions = {
  toggleMenu ({ commit }) {
    commit('TOGGLE_MENU_HIDDEN')
  },
  changeRealm ({ commit }, realm) {
    commit('CHANGE_REALM', realm)
  },
  setTeams ({ commit }, teams) {
    commit('SET_TEAMS', teams)
  },
  setTeam ({ commit }, team) {
    commit('SET_TEAM', team)
  }
}
