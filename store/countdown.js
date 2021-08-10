export const state = () => {
  return {
    list: []
  }
}

export const getters = {
  list: state => state.list,
  getByPatient: state => id => state.list.find(e => e.patientId === id)
}

export const mutations = {
  start (state, counting) {
    // Find exist counting
    const existIndex = state.list.findIndex(e => e._id === counting._id)

    // If existed, update
    if (existIndex >= 0) {
      state.list[existIndex] = counting
    } else {
      // Otherwise, add new one
      state.list.push(counting)
    }
  },
  stop (state, counting) {
    // Find exist counting
    const existIndex = state.list.findIndex(e => e._id === counting._id)

    // If existed, update
    if (existIndex >= 0) {
      state.list.splice(existIndex, 1)
      // state.list[existIndex] = counting
    }
  },
  all (state, countings) {
    state.list = countings
  }
}
