<template>
  <a
    v-if="settings.github"
    :href="githubUrls.repo"
    target="_blank"
    rel="noopener noreferrer"
    title="Github"
    name="Github"
    class="inline-flex text-4xl text-gray-700 dark:text-gray-300"
  >
    <FontAwesomeIcon :icon="faGithub" class="hover:text-primary-500" />
  </a>
</template>

<script>
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters(['settings', 'githubUrls']),
    faGithub () {
      return faGithub
    }
  }
})
</script>
