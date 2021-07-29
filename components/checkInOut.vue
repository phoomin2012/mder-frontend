<template>
  <b-card :title="$t('check.title')">
    <b-input :placeholder="$t('check.username')" />
    <div class="d-flex justify-content-around mt-2">
      <b-button variant="outline-success" size="sm" block class="mt-0">
        <fa-icon icon="user-plus" />
        {{ $t('check.in') }}
      </b-button>
      <div>&nbsp;</div>
      <b-button variant="outline-danger" size="sm" block class="mt-0">
        <fa-icon icon="user-minus" />
        {{ $t('check.out') }}
      </b-button>
    </div>
  </b-card>
</template>

<script>
export default {

}
</script>
