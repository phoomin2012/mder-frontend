/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Sweetalert from 'sweetalert2'

let _Swal = Sweetalert.mixin()
export let Swal = Sweetalert.mixin({
})

export let Toast = Sweetalert.mixin({
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

export let Prompt = Sweetalert.mixin({
//   confirmButtonText: Vue.i18n.t('popup.confirm'),
  showConfirmButton: true,
  showCancelButton: true,
  showLoaderOnConfirm: true
})

export default function ({ app, i18n }) {
  _Swal = Sweetalert.mixin({
    confirmButtonText: app.i18n.t('popup.close'),
    cancelButtonText: app.i18n.t('popup.cancel'),
    denyButtonText: app.i18n.t('popup.deny')
  })

  Swal = _Swal
  Toast = _Swal.mixin({
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
  Prompt = _Swal.mixin({
    confirmButtonText: app.i18n.t('popup.confirm'),
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true
  })
}
