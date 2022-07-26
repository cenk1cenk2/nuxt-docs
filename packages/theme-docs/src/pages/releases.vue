<template>
  <div
    class="flex flex-wrap-reverse"
    :class="{
      'lg:-mx-8': settings.layout === 'single'
    }"
  >
    <div
      class="py-4 w-full lg:pt-8 lg:pb-4 lg:w-3/4 dark:border-gray-800"
      :class="{
        'lg:border-l lg:border-r': settings.layout !== 'single'
      }"
    >
      <article class="max-w-none lg:px-8 prose dark:prose-dark">
        <h1>Releases</h1>

        <div v-for="release of releases" :key="release.name">
          <h2 :id="release.name" class="flex justify-between items-center">
            {{ release.name }}
            <span class="text-base font-normal text-gray-500">{{ formatDate(release) }}</span>
          </h2>

          <div class="nuxt-content" v-html="release.body" />
        </div>
      </article>
    </div>

    <AppToc :toc="toc" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  layout ({ store }) {
    return store.state.settings.layout || 'default'
  },
  head () {
    return {
      title: 'Releases'
    }
  },
  computed: {
    ...mapGetters(['settings']),
    releases () {
      return this.$store.state.releases
    },
    toc () {
      return this.releases.map(release => ({
        id: release.name,
        depth: 2,
        text: release.name
      }))
    }
  },
  methods: {
    formatDate (release) {
      const date = new Date(release.date)

      return date.toLocaleDateString(this.$i18n.locale)
    }
  }
})
</script>
