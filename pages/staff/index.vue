<template>
  <div>
    <h1>Staff Management</h1>
    <b-card no-body>
      <b-card-header>
        <b-button to="/staff/new" size="sm" variant="success" class="float-right">
          <fa-icon icon="plus" />
          {{ $t('staff.new') }}
        </b-button>
      </b-card-header>
      <b-overlay :show="loading" rounded="sm">
        <b-table :fields="fields" :items="filteredItems" responsive class="mb-0">
          <template #cell(_id)="data">
            {{ data.index + 1 }}
          </template>
          <template #cell(role)="data">
            {{ $t(`staff.roles.${data.item.role}`) }}
          </template>
          <template #cell(actions)="data">
            <b-button size="sm" variant="warning" :to="`/staff/${data.item._id}`">
              <fa-icon icon="edit" />
              {{ $t('staff.edit') }}
            </b-button>
            <b-button size="sm" variant="danger" @click="promptRemove(data.item)">
              <fa-icon icon="trash-alt" />
              {{ $t('staff.remove') }}
            </b-button>
          </template>
        </b-table>
      </b-overlay>
    </b-card>
  </div>
</template>

<script>
import { Prompt } from '@/plugins/sweetalert2'

export default {
  data () {
    return {
      items: [],
      loading: false
    }
  },

  computed: {
    fields () {
      return [
        { key: '_id', label: '#' },
        { key: 'username', label: this.$t('staff.username') },
        { key: 'name', label: this.$t('staff.name') },
        { key: 'lastName', label: this.$t('staff.lastName') },
        { key: 'role', label: this.$t('staff.role') },
        { key: 'actions', label: this.$t('table.actions') }
      ]
    },
    filteredItems () {
      return this.items
    }
  },

  created () {
    this.fetchItems()
  },

  methods: {
    async fetchItems () {
      try {
        this.loading = true
        const { data } = await this.$axios.get('/api/staff')
        this.$set(this, 'items', data)
      } catch (e) {

      }
      this.loading = false
    },
    promptRemove (staff) {
      Prompt.fire({
        title: this.$t('popup.staff.remove.title', [staff.name, staff.lastName]),
        text: this.$t('popup.staff.remove.text'),
        icon: 'question',
        preConfirm: () => {
          return this.$axios.delete(`/api/staff/${staff._id}`)
        }
      }).then((value) => {

      })
    }
  }
}
</script>
