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
  currentPatient: state => state.currentPatient,
  todayPatient: state => state.todayPatient
}

export const mutations = {
  // Feature 5: Check In/Check Out
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
  // Feature 3: Patient Management
  increasePatient (state) {
    state.currentPatient += 1
  },
  decreasePatient (state) {
    state.currentPatient -= 1
  },
  setPatient (state, amount) {
    state.currentPatient = amount
  },
  // Feature 2: Today patient
  setTodayPatient (state, amount) {
    state.todayPatient = amount
  }
}

export const actions = {
  // Feature 5: Check In/Check Out
  checkIn ({ commit }, role) {
    if (role === 'physician') {
      commit('increasePhysician')
    } else if (role === 'nurse') {
      commit('increaseNurse')
    }
  },
  checkOut ({ commit }, role) {
    if (role === 'physician') {
      commit('decreasePhysician')
    } else if (role === 'nurse') {
      commit('decreaseNurse')
    }
  }
}
