/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Sweetalert from 'sweetalert2'

export const Swal = Sweetalert.mixin({
})

export const Toast = Sweetalert.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Sweetalert.stopTimer)
    toast.addEventListener('mouseleave', Sweetalert.resumeTimer)
  }
})

export const Prompt = Sweetalert.mixin({
  showConfirmButton: true,
  showCancelButton: true,
  showLoaderOnConfirm: true
})

export default function ({ app }) {
  Swal.update({
    confirmButtonText: app.i18n.t('popup.close'),
    cancelButtonText: app.i18n.t('popup.cancel'),
    denyButtonText: app.i18n.t('popup.deny')
  })

  Prompt.update({
    confirmButtonText: app.i18n.t('popup.confirm'),
    cancelButtonText: app.i18n.t('popup.cancel'),
    denyButtonText: app.i18n.t('popup.deny')
  })

  // Listen on language change
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    Swal.update({
      confirmButtonText: app.i18n.t('popup.close'),
      cancelButtonText: app.i18n.t('popup.cancel'),
      denyButtonText: app.i18n.t('popup.deny')
    })

    Prompt.update({
      confirmButtonText: app.i18n.t('popup.confirm'),
      cancelButtonText: app.i18n.t('popup.cancel'),
      denyButtonText: app.i18n.t('popup.deny')
    })
  }
}
