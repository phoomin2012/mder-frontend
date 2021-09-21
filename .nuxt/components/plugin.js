import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  CheckInOut: () => import('../../components/checkInOut.vue' /* webpackChunkName: "components/check-in-out" */).then(c => wrapFunctional(c.default || c)),
  ErrorHandle: () => import('../../components/error-handle.vue' /* webpackChunkName: "components/error-handle" */).then(c => wrapFunctional(c.default || c)),
  Sidebar: () => import('../../components/sidebar.vue' /* webpackChunkName: "components/sidebar" */).then(c => wrapFunctional(c.default || c)),
  DashboardStatistics24Hour: () => import('../../components/dashboard/Statistics24Hour.vue' /* webpackChunkName: "components/dashboard-statistics24-hour" */).then(c => wrapFunctional(c.default || c)),
  DashboardCountDownBox: () => import('../../components/dashboard/countDownBox.vue' /* webpackChunkName: "components/dashboard-count-down-box" */).then(c => wrapFunctional(c.default || c)),
  DashboardCountdownForm: () => import('../../components/dashboard/countdownForm.vue' /* webpackChunkName: "components/dashboard-countdown-form" */).then(c => wrapFunctional(c.default || c)),
  DashboardOvercrowdMeter: () => import('../../components/dashboard/overcrowdMeter.vue' /* webpackChunkName: "components/dashboard-overcrowd-meter" */).then(c => wrapFunctional(c.default || c)),
  DashboardPatientInformation: () => import('../../components/dashboard/patientInformation.vue' /* webpackChunkName: "components/dashboard-patient-information" */).then(c => wrapFunctional(c.default || c)),
  HistoryPeriodButton: () => import('../../components/history/periodButton.vue' /* webpackChunkName: "components/history-period-button" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
