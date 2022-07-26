<template>
  <aside
    class="fixed inset-0 z-30 mt-16 w-full bg-white lg:block lg:relative lg:mt-0 lg:w-1/5 lg:bg-transparent dark:bg-gray-900 lg:dark:bg-transparent"
    :class="{ block: menu, hidden: !menu }"
  >
    <div class="lg:sticky lg:top-16 overflow-y-auto h-full lg:h-auto lg:max-h-(screen-16)">
      <ul class="p-4 lg:py-8 lg:pr-8 lg:pl-0">
        <li v-if="!settings.algolia" class="mb-4 lg:hidden">
          <AppSearch />
        </li>
        <li
          v-for="(docs, category, index) in categories"
          :key="category"
          class="mb-4"
          :class="{
            active: isCategoryActive(docs),
            'lg:mb-0': index === Object.keys(categories).length - 1
          }"
        >
          <p v-if="category" class="mb-2 font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400">{{ category }}</p>
          <ul>
            <li v-for="doc of docs" :key="doc.slug" class="text-gray-700 dark:text-gray-300">
              <NuxtLink
                :to="localePath(doc.to)"
                class="flex justify-between items-center py-1 px-2 font-medium rounded hover:text-primary-500"
                exact-active-class="bg-gray-200 dark:bg-gray-800 text-primary-500 hover:text-primary-500"
              >
                {{ doc.menuTitle || doc.title }}
                <client-only>
                  <span v-if="isDocumentNew(doc)" class="w-2 h-2 rounded-full opacity-75 animate-pulse bg-primary-500" />
                </client-only>
              </NuxtLink>
            </li>
          </ul>
        </li>
        <li class="space-x-2 lg:hidden">
          <p class="mb-2 font-bold tracking-wider text-gray-500 uppercase">More</p>
          <AppIcons />
        </li>
      </ul>
      <div class="block lg:hidden" style="padding-block: 40px"></div>
    </div>
  </aside>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters(['settings']),
    menu: {
      get () {
        return this.$store.state.menu.open
      },
      set (val) {
        this.$store.commit('menu/toggle', val)
      }
    },
    categories () {
      return this.$store.state.categories[this.$i18n.locale]
    }
  },
  methods: {
    isCategoryActive (documents) {
      return documents.some(document => document.to === this.$route.fullPath)
    },
    isDocumentNew (document) {
      if (process.server) {
        return
      }

      if (!document.version || document.version <= 0) {
        return
      }

      const version = localStorage.getItem(`document-${document.slug}-version`)

      if (document.version > Number(version)) {
        return true
      }

      return false
    }
  }
})
</script>
