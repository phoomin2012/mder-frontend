import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChartArea,
  faSignOutAlt,
  faTachometerAlt,
  faUserInjured,
  faUserMd,
  faTrashAlt,
  faEdit,
  faPlus,
  faSave,
  faLongArrowAltLeft,
  faCheck,
  faTimes,
  faUserPlus,
  faUserMinus,
  faClock,
  faCaretUp,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserMd, faUserInjured, faTachometerAlt, faChartArea, faSignOutAlt, faTrashAlt, faEdit, faPlus, faSave, faLongArrowAltLeft, faCheck, faTimes, faUserPlus, faUserMinus, faClock)
library.add(faCaretUp, faCaretDown)

Vue.component('FaIcon', FontAwesomeIcon)
