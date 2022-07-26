<template>
  <footer class="relative z-20 w-full h-16 bg-white border-t dark:bg-gray-900 dark:border-gray-800">
    <div class="flex justify-between items-center px-4 mx-auto w-full h-full lg:container lg:px-8">
      <div class="flex items-end">
        <a href="https://nuxtjs.org" target="_blank" rel="noopener">
          <BuiltWithNuxtLight class="h-4 light-img" />
          <BuiltWithNuxtDark class="h-4 dark-img" />
        </a>
      </div>
      <div class="flex items-center space-x-4">
        <a
          href="https://kilic.dev"
          rel="noopener noreferrer"
          title="kilic.dev"
          name="kilic.dev"
          class="ml-4 text-gray-700 dark:text-gray-300 dark-hover:text-primary-500 hover:text-primary-500"
        >
          <span class="p-1 bg-gray-200 rounded-lg dark:bg-gray-800">
            <FontAwesomeIcon :icon="fa.faTerminal" class="pt-1 text-lg text-primary-500" />
          </span>
          <span class="text-xl ml-1/2">kilic.dev</span>
        </a>
      </div>
    </div>
    <div class="block" style="padding-block: 40px"></div>
  </footer>
</template>

<script>
import { faTerminal } from '@fortawesome/free-solid-svg-icons'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    },
    fa () {
      return { faTerminal }
    }
  }
})
</script>
