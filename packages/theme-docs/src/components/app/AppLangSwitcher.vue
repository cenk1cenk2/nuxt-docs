<template>
  <AppDropdown v-if="availableLocales.length" class="inline-flex">
    <template #trigger="{ open, toggle }">
      <button class="rounded-md focus:outline-none hover:text-primary-500" :class="{ 'text-primary-500': open }" @touchstart.stop.prevent="toggle">
        <IconTranslate class="w-6 h-6" />
      </button>
    </template>

    <ul class="py-2">
      <li v-for="locale in availableLocales" :key="locale.code">
        <nuxt-link v-if="$i18n.locale !== locale.code" :to="switchLocalePath(locale.code)" class="flex items-center px-4 leading-7 whitespace-no-wrap hover:text-primary-500">{{
          locale.name
        }}</nuxt-link>
      </li>
    </ul>
  </AppDropdown>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    }
  }
})
</script>
