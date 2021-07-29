export const state = () => {
  return {
    currentPhysician: 0,
    currentNurse: 0,
    currentPatient: 0,
    todayPatient: 0
  }
}

export const getters = {
  currentPhysician: state => state.currentPhysician,
  currentNurse: state => state.currentNurse,
  currentPatient: state => state.currentPatient
}

export const mutations = {
  increasePhysician (state) {
    state.currentPhysician += 1
  },
  decreasePhysician (state) {
    state.currentPhysician -= 1
  },
  setPhysician (state, amount) {
    state.currentPhysician = amount
  },

  increaseNurse (state) {
    state.currentNurse += 1
  },
  decreaseNurse (state) {
    state.currentNurse -= 1
  },
  setNurse (state, amount) {
    state.currentNurse = amount
  },

  increasePatient (state) {
    state.currentPatient += 1
  },
  decreasePatient (state) {
    state.currentPatient -= 1
  },
  setPatient (state, amount) {
    state.currentPatient = amount
  }
}
