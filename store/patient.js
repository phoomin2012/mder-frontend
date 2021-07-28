import Vue from 'vue'

export const state = () => ({
  list: []
})

export const getters = {
  all: state => state.list,
  getById: state => id => state.list.find(p => p._id === id)
}

export const mutations = {
  add (state, patient) {
    const index = state.list.findIndex(p => p._id === patient._id)
    if (index >= 0) {
      state.list[index] = patient
    } else {
      state.list.push(patient)
    }
  },
  update (state, patient) {
    const index = state.list.findIndex(p => p._id === patient._id)
    if (index >= 0) {
      Vue.set(state.list, index, patient)
    }
  },
  remove (state, patientId) {
    const index = state.list.findIndex(p => p._id === patientId)
    state.list.splice(index, 1)
  },
  clear (state) {
    state.list = []
  },
  all (state, patients) {
    state.list = patients
  }
}
