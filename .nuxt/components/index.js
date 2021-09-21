import { wrapFunctional } from './utils'

export { default as CheckInOut } from '../../components/checkInOut.vue'
export { default as ErrorHandle } from '../../components/error-handle.vue'
export { default as Sidebar } from '../../components/sidebar.vue'
export { default as DashboardStatistics24Hour } from '../../components/dashboard/Statistics24Hour.vue'
export { default as DashboardCountDownBox } from '../../components/dashboard/countDownBox.vue'
export { default as DashboardCountdownForm } from '../../components/dashboard/countdownForm.vue'
export { default as DashboardOvercrowdMeter } from '../../components/dashboard/overcrowdMeter.vue'
export { default as DashboardPatientInformation } from '../../components/dashboard/patientInformation.vue'
export { default as HistoryPeriodButton } from '../../components/history/periodButton.vue'

export const LazyCheckInOut = import('../../components/checkInOut.vue' /* webpackChunkName: "components/check-in-out" */).then(c => wrapFunctional(c.default || c))
export const LazyErrorHandle = import('../../components/error-handle.vue' /* webpackChunkName: "components/error-handle" */).then(c => wrapFunctional(c.default || c))
export const LazySidebar = import('../../components/sidebar.vue' /* webpackChunkName: "components/sidebar" */).then(c => wrapFunctional(c.default || c))
export const LazyDashboardStatistics24Hour = import('../../components/dashboard/Statistics24Hour.vue' /* webpackChunkName: "components/dashboard-statistics24-hour" */).then(c => wrapFunctional(c.default || c))
export const LazyDashboardCountDownBox = import('../../components/dashboard/countDownBox.vue' /* webpackChunkName: "components/dashboard-count-down-box" */).then(c => wrapFunctional(c.default || c))
export const LazyDashboardCountdownForm = import('../../components/dashboard/countdownForm.vue' /* webpackChunkName: "components/dashboard-countdown-form" */).then(c => wrapFunctional(c.default || c))
export const LazyDashboardOvercrowdMeter = import('../../components/dashboard/overcrowdMeter.vue' /* webpackChunkName: "components/dashboard-overcrowd-meter" */).then(c => wrapFunctional(c.default || c))
export const LazyDashboardPatientInformation = import('../../components/dashboard/patientInformation.vue' /* webpackChunkName: "components/dashboard-patient-information" */).then(c => wrapFunctional(c.default || c))
export const LazyHistoryPeriodButton = import('../../components/history/periodButton.vue' /* webpackChunkName: "components/history-period-button" */).then(c => wrapFunctional(c.default || c))
