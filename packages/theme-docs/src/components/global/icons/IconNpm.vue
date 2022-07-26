<template>
  <a
    v-if="settings.npm"
    :href="npmUrls.repo"
    target="_blank"
    rel="noopener noreferrer"
    title="NPM"
    name="NPM"
    class="inline-flex text-4xl text-gray-700 dark:text-gray-300"
  >
    <FontAwesomeIcon :icon="faNpm" class="hover:text-primary-500" />
  </a>
</template>

<script>
import { faNpm } from '@fortawesome/free-brands-svg-icons'
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters(['settings', 'npmUrls']),
    faNpm () {
      return faNpm
    }
  }
})
</script>
