<template>
  <div>
    <div v-if="githubIssue" class="p-2 mt-2 mb-2 bg-gray-100 border-l-4 border-gray-500 dark:bg-gray-800 alert">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <FontAwesomeIcon :icon="icons.faGithub" class="mt-px w-6 h-6 alert-icon" />
        </div>
        <div class="overflow-auto flex-grow ml-2 alert-content">
          <p>
            This is related to the discussions on
            <a :href="githubIssue.html_url">issue #{{ issue }}: "{{ githubIssue.title }}"</a>.
          </p>
          <br />
          <p>
            Thanks <a :href="githubIssue.user.html_url">{{ githubIssue.user.login }}</a> for bringing this up!
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      <Alert type="danger">Can not load the GitHub issue #{{ issue }} for repository {{ store.settings.github }} from the GitHub API.</Alert>
    </div>
  </div>
</template>

<script>
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { defineComponent, useContext, useStatic, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    issue: {
      required: true,
      type: String
    }
  },
  setup (props) {
    const { $axios } = useContext()
    const store = useStore()

    const githubUrls = store.getters.githubUrls
    const settings = store.getters.settings

    const githubIssue = useStatic(
      async () => {
        let res

        try {
          res = await $axios.get('https://api.github.com/repos/' + settings.github + '/issues/' + props.issue)
        } catch (err) {
          return
        }

        return res.data
      },
      props.issue,
      props.issue
    )

    return {
      store: {
        githubUrls,
        settings
      },
      icons: {
        faGithub
      },
      githubIssue
    }
  }
})
</script>

<style lang="postcss">
.alert p {
  @apply m-0 !important;
}

.alert a {
  @apply text-gray-700 !important;
}
.dark .alert a {
  @apply text-gray-300 !important;
}

.alert strong {
  @apply text-current;
}

.alert-content pre code {
  background-color: inherit !important;
}
</style>
