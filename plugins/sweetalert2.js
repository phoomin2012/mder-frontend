/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Sweetalert from 'sweetalert2'

let i18n = {
  t (a) { return a }
}

console.log(global)

export const Swal = Sweetalert.mixin({
  confirmButtonText: i18n.t('popup.close'),
  cancelButtonText: i18n.t('popup.cancel'),
  denyButtonText: i18n.t('popup.deny')
})

export const Toast = Sweetalert.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Sweetalert.stopTimer)
    toast.addEventListener('mouseleave', Sweetalert.resumeTimer)
  }
})

export const Prompt = Sweetalert.mixin({
  confirmButtonText: i18n.t('popup.confirm'),
  showConfirmButton: true,
  showCancelButton: true,
  showLoaderOnConfirm: true
})

export default function ({ app }) {
  i18n = app.i18n
}
