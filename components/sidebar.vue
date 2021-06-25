<template>
  <div class="sidebar">
    <ul>
      <li>
        <nuxt-link to="/dashboard">
          Dashboard
        </nuxt-link>
      </li>

      <li>
        <nuxt-link to="/patient/add">
          Add patient
        </nuxt-link>
      </li>

      <li>
        <nuxt-link to="/staff">
          Staff management
        </nuxt-link>
      </li>

      <li v-if="false">
        <nuxt-link to="/history">
          History
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

}
</script>
