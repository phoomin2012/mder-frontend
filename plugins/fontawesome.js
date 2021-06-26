import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartArea, faSignOutAlt, faTachometerAlt, faUserInjured, faUserMd, faTrashAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserMd, faUserInjured, faTachometerAlt, faChartArea, faSignOutAlt, faTrashAlt, faEdit, faPlus)

Vue.component('FaIcon', FontAwesomeIcon)
