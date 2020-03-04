export const strict = true

export const state = () => ({
  glueForm: {
    AWSAccount: '',
    AWSRegion: '',
    database: '',
    table: '',
    snapshotDate: '',
    completeTime: ''
  },

  edxForm: {
    provider: '',
    subject: '',
    dataset: '',
    snapshotDate: '',
    completeTime: ''
  },

  s3Form: {
    s3Bucket: '',
    s3Prefix: '',
    snapshotDate: '',
    completeTime: ''
  },

  ddbForm: {
    AWSAccount: '',
    AWSRegion: '',
    table: '',
    snapshotDate: '',
    completeTime: ''
  },

  jobForm: {
    namespace: '',
    shortName: '',
    snapshotDate: '',
    completeTime: ''
  },

  type: ''
})

export const mutations = {
  SET_GLUE_FORM(state, form) {
    state.glueForm = form
  },
  SET_EDX_FORM(state, form) {
    state.edxForm = form
  },
  SET_DDB_FORM(state, form) {
    state.ddbForm = form
  },
  SET_S3_FORM(state, form) {
    state.s3Form = form
  },
  SET_JOB_FORM(state, form) {
    state.jobForm = form
  },
  SET_TYPE(state, type) {
    state.type = type
  },
  RESET_FORMS(state) {
    state.glueForm = {
      AWSAccount: '',
      AWSRegion: '',
      database: '',
      table: '',
      snapshotDate: '',
      completeTime: ''
    }

    state.edxForm = {
      provider: '',
      subject: '',
      dataset: '',
      snapshotDate: '',
      completeTime: ''
    }

    state.s3Form = {
      s3Bucket: '',
      s3Prefix: '',
      snapshotDate: '',
      completeTime: ''
    }

    state.ddbForm = {
      AWSAccount: '',
      AWSRegion: '',
      table: '',
      snapshotDate: '',
      completeTime: ''
    }

    state.jobForm = {
      namespace: '',
      shortName: '',
      snapshotDate: '',
      completeTime: ''
    }
  }
}

export const getters = {
  glueForm(state) {
    return state.glueForm
  },
  edxForm(state) {
    return state.edxForm
  },
  ddbForm(state) {
    return state.ddbForm
  },
  s3Form(state) {
    return state.s3Form
  },
  jobForm(state) {
    return state.jobForm
  },
  type(state) {
    return state.type
  }
}

export const actions = {
  setGlueForm({ commit }, form) {
    commit('SET_GLUE_FORM', form)
  },
  setDDBForm({ commit }, form) {
    commit('SET_DDB_FORM', form)
  },
  setS3Form({ commit }, form) {
    commit('SET_S3_FORM', form)
  },
  setEDXForm({ commit }, form) {
    commit('SET_EDX_FORM', form)
  },
  setJobForm({ commit }, form) {
    commit('SET_JOB_FORM', form)
  },
  setType({ commit }, type) {
    commit('SET_TYPE', type)
  },
  resetForms({ commit }) {
    commit('RESET_FORMS')
  }
}
