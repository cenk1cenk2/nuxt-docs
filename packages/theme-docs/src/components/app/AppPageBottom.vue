<template>
  <div v-if="link" class="flex flex-col justify-between pt-4 pb-4 sm:flex-row lg:px-8">
    <a :href="link" target="_blank" rel="noopener" class="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:underline">
      {{ $t('article.github') }}
      <IconExternalLink class="ml-1 w-4 h-4" />
    </a>
    <span class="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400"> {{ $t('article.updatedAt') }} {{ $d(Date.parse(document.updatedAt), 'long') }} </span>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  props: {
    document: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([ 'settings', 'githubUrls' ]),
    link () {
      if (!this.settings.github) {
        return
      }

      return [
        this.githubUrls?.docs?.repo ?? this.githubUrls.repo,
        'edit',
        this.githubUrls?.docs?.branch ?? this.settings.defaultBranch,
        this.githubUrls?.docs?.prefix ?? this.settings.defaultDir,
        `content${this.document.path}${this.document.extension}`
      ]
        .filter((path) => !!path)
        .join('/')
    }
  }
})
</script>
