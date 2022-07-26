<template>
  <div class="flex relative flex-col justify-between w-full">
    <div class="relative w-full" @keydown.down="increment" @keydown.up="decrement" @keydown.enter="go">
      <label for="search" class="sr-only">Search</label>
      <div class="relative">
        <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <IconSearch class="w-5 h-5 text-gray-500" />
        </div>
        <input
          id="search"
          ref="search"
          v-model="q"
          class="block py-2 pr-3 pl-10 w-full leading-5 placeholder-gray-500 text-gray-500 bg-gray-200 rounded-md border border-transparent dark:text-white dark:bg-gray-700 focus:bg-white focus:border-gray-300 focus:outline-none truncate dark-focus:text-white dark-focus:border-gray-700 dark-focus:bg-gray-900"
          :class="{ 'rounded-b-none': focus && (searching || results.length) }"
          :placeholder="$t('search.placeholder')"
          type="search"
          autocomplete="off"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </div>
    <ul
      v-show="focus && (searching || results.length)"
      class="overflow-hidden absolute top-0 z-10 flex-1 w-full bg-white rounded-md border border-gray-300 dark:bg-gray-900 dark:border-gray-700"
      :class="{ 'rounded-t-none': focus && (searching || results.length) }"
      style="margin-top: 37px"
    >
      <li v-if="searching && !results.length" class="py-2 px-4">Searching...</li>
      <li v-for="(result, index) of results" :key="result.slug" @mouseenter="focusIndex = index" @mousedown="go">
        <NuxtLink
          :to="localePath(result.to)"
          class="flex items-center py-2 px-4 leading-5 transition duration-150 ease-in-out"
          :class="{
            'text-primary-500 bg-gray-200 dark:bg-gray-800': focusIndex === index
          }"
          @click="focus = false"
        >
          <span v-if="result.category" class="font-bold">{{ result.category }}</span>
          <FontAwesomeIcon v-if="result.category" :icon="fa.faChevronRight" class="mx-1 w-3 h-3" />
          {{ result.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  data () {
    return {
      q: '',
      focus: false,
      focusIndex: -1,
      open: false,
      searching: false,
      results: []
    }
  },
  computed: {
    fa () {
      return { faChevronRight }
    }
  },
  watch: {
    async q (q) {
      this.focusIndex = -1

      if (!q) {
        this.searching = false
        this.results = []

        return
      }
      this.searching = true
      this.results = await this.$content(this.$i18n.locale, { deep: true }).sortBy('position', 'asc').only(['title', 'slug', 'category', 'to']).limit(12).search(q).fetch()
      this.searching = false
    }
  },
  mounted () {
    window.addEventListener('keyup', this.keyup)
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.keyup)
  },
  methods: {
    onFocus () {
      this.focus = true
      this.$emit('focus', true)
    },
    onBlur () {
      this.focus = false
      this.$emit('focus', false)
    },
    keyup (e) {
      if (e.key === '/') {
        this.$refs.search.focus()
      }
    },
    increment () {
      if (this.focusIndex < this.results.length - 1) {
        this.focusIndex++
      }
    },
    decrement () {
      if (this.focusIndex >= 0) {
        this.focusIndex--
      }
    },
    go () {
      if (this.results.length === 0) {
        return
      }
      const result = this.focusIndex === -1 ? this.results[0] : this.results[this.focusIndex]

      this.$router.push(this.localePath(result.to))
      // Unfocus the input and reset the query.
      this.$refs.search.blur()
      this.q = ''
    }
  }
})
</script>
