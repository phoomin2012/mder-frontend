import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartArea, faSignOutAlt, faTachometerAlt, faUserInjured, faUserMd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserMd, faUserInjured, faTachometerAlt, faChartArea, faSignOutAlt)

Vue.component('FaIcon', FontAwesomeIcon)
