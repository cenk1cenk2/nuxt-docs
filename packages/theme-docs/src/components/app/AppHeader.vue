<template>
  <nav class="fixed top-0 z-40 w-full transition-colors transition-shadow dark:border-gray-600" :class="{ 'shadow border-b bg-gray-100 dark:bg-gray-800': scrolled }">
    <div class="flex-1 px-4 mx-auto lg:container lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center pr-4 lg:w-1/5" @click.stop="noop">
          <NuxtLink :to="localePath('/')" class="flex-1 flex-shrink-0 text-3xl font-bold" :aria-label="`${settings.title} Logo`">
            <span v-if="!logo">{{ settings.title }}</span>

            <img v-if="logo" :src="logo.light" class="max-w-full h-8 light-img" :alt="settings.title" />
            <img v-if="logo" :src="logo.dark" class="max-w-full h-8 dark-img" :alt="settings.title" />
          </NuxtLink>
        </div>

        <div v-if="settings.layout !== 'single'" class="flex flex-1 justify-start w-4/6">
          <AppSearchAlgolia v-if="settings.algolia" :options="settings.algolia" :settings="settings" />
          <AppSearch v-else class="hidden lg:block" />
        </div>

        <div
          class="flex items-center pl-4 lg:pl-8 lg:w-1/5"
          :class="{ 'justify-between': lastRelease && settings.layout !== 'single', 'justify-end': !lastRelease || settings.layout === 'single' }"
        >
          <NuxtLink
            v-if="lastRelease"
            :to="localePath('/releases')"
            class="mr-4 text-lg font-semibold leading-none text-gray-700 dark:text-gray-300 dark-hover:text-primary-500 hover:text-primary-500"
            exact-active-class="text-primary-500"
          >{{ lastRelease.name }}</NuxtLink>

          <div class="flex hidden items-center lg:inline">
            <AppIcons />
          </div>
        </div>
      </div>
    </div>

    <div class="fixed right-4 bottom-4 z-50">
      <div class="flex space-x-4 flex-end">
        <!-- Menu button on smaller screens -->
        <button
          v-if="settings.layout !== 'single' && scrolled"
          class="w-16 h-16 text-white bg-gray-600 rounded-full focus:outline-none"
          aria-label="Go to top."
          @click="scrollToTop()"
        >
          <FontAwesomeIcon :icon="fa.faChevronUp" class="inline-block self-center text-3xl hover:text-primary-500" />
        </button>
        <!-- Go to top button -->
        <button v-if="settings.layout !== 'single'" class="w-16 h-16 text-white bg-gray-600 rounded-full lg:hidden focus:outline-none" aria-label="Menu" @click.stop="menu = !menu">
          <FontAwesomeIcon v-if="menu" :icon="fa.faTimes" class="inline-block self-center pt-1 text-3xl hover:text-primary-500" />
          <FontAwesomeIcon v-else :icon="fa.faBars" class="inline-block self-center pt-1 text-3xl hover:text-primary-500" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { faChevronUp, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  data () {
    return {
      scrolled: 0
    }
  },
  computed: {
    ...mapGetters(['settings', 'githubUrls', 'lastRelease']),
    menu: {
      get () {
        return this.$store.state.menu.open
      },
      set (val) {
        this.$store.commit('menu/toggle', val)
      }
    },
    logo () {
      if (!this.settings.logo) {
        return
      }

      if (typeof this.settings.logo === 'object') {
        return this.settings.logo
      }

      return {
        light: this.settings.logo,
        dark: this.settings.logo
      }
    },
    fa () {
      return {
        faChevronUp,
        faBars,
        faTimes
      }
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      this.scrolled = window.scrollY > 0
    },
    scrollToTop () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    noop () {}
  }
})
</script>
