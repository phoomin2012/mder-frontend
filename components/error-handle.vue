<script>
export default {
  name: 'ErrorHandle',
  props: {
    errors: {
      type: Array,
      default () {
        return []
      }
    },
    prefix: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: ''
    },
    noValid: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _errors () {
      if (Array.isArray(this.errors)) {
        return this.errors
      } else if (typeof this.errors === 'string') {
        return [this.errors]
      } else {
        return []
      }
    },
    state () {
      if (this._errors.length === 0) {
        return null
      }
      const reg = new RegExp(`^${this.name}\\.`)
      const result =
        !this._errors.filter(e => reg.test(e)).length > 0
      return result && this.noValid ? null : result
    },
    description () {
      if (this._errors.length === 0) {
        return null
      }

      const reg = new RegExp(`^${this.name}\\.`)
      const filteredErrors = this._errors.filter(e => reg.test(e))
      if (filteredErrors.length > 0) {
        return this.$t('error.form.' + (this.prefix ? this.prefix + '.' : '') + filteredErrors[0])
      }
      return null
    }
  },
  render () {
    return this.$scopedSlots.default({
      state: this.state,
      invalidFeedback: this.description
    })
  }
}
</script>
