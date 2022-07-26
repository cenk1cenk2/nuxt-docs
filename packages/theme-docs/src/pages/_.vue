<template>
  <div
    class="flex flex-wrap-reverse"
    :class="{
      'lg:-mx-8': settings.layout === 'single'
    }"
  >
    <div
      class="py-4 w-full lg:pt-8 lg:pb-4 dark:border-gray-800"
      :class="{
        'lg:w-3/4': !document.fullscreen,
        'lg:border-l lg:border-r': settings.layout !== 'single'
      }"
    >
      <article class="max-w-none lg:px-8 prose dark:prose-dark">
        <h1 id="document-title" class="flex justify-between items-center">
          {{ document.title }}
          <Badge v-if="document.badge">{{ document.badge }}</Badge>
        </h1>
        <div v-if="document.subtitle" class="-mt-4">
          <p class="text-gray-600 dark:text-gray-400">{{ document.subtitle }}</p>
        </div>

        <NuxtContent :document="document" />
      </article>

      <AppPageBottom :document="document" />
      <AppPrevNext :prev="prev" :next="next" />
    </div>

    <AppToc v-if="!document.fullscreen" :toc="document.toc" :document="document" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import Vue from 'vue'
import { mapGetters } from 'vuex'

import AppCopyButton from '~/components/app/AppCopyButton'

export default defineComponent({
  name: 'PageSlug',
  layout ({ store }) {
    return store.state.settings.layout || 'default'
  },
  middleware ({ app, params, redirect }) {
    if (params.pathMatch === 'index') {
      redirect(app.localePath('/'))
    }
  },
  async asyncData ({ $content, app, params, error }) {
    const path = `/${app.i18n.locale}/${params.pathMatch || 'index'}`
    const [document] = await $content({ deep: true }).where({ path }).fetch()

    if (!document) {
      return error({ statusCode: 404, message: 'Page not found' })
    }

    const [prev, next] = await $content(app.i18n.locale, { deep: true })
      .only(['title', 'path', 'to'])
      .sortBy('position', 'asc')
      .surround(document.path, { before: 1, after: 1 })
      .fetch()

    return {
      document,
      prev,
      next
    }
  },
  head () {
    return {
      title: this.document.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.document.description
        },
        // Open Graph
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.document.title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.document.description
        },
        // Twitter Card
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.document.title
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.document.description
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['settings'])
  },
  mounted () {
    if (this.document.version) {
      localStorage.setItem(`document-${this.document.slug}-version`, this.document.version)
    }

    setTimeout(() => {
      const blocks = document.getElementsByClassName('nuxt-content-highlight')

      for (const block of blocks) {
        const CopyButton = Vue.extend(AppCopyButton)
        const component = new CopyButton().$mount()

        block.appendChild(component.$el)
      }
    }, 100)
  }
})
</script>
