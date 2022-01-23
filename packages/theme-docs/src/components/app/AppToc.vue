<template>
  <div v-if="toc.length" class="block relative w-full lg:w-1/4">
    <div class="lg:sticky lg:top-16 overflow-y-auto h-full lg:h-auto lg:max-h-(screen-16)">
      <nav
        class="py-4 lg:py-8"
        :class="{
          'lg:pl-8 lg:pr-2': settings.layout !== 'single',
          'lg:px-8': settings.layout === 'single'
        }"
      >
        <div class="flex justify-between self-center group" @click.stop="tocToggle = !tocToggle">
          <span class="mb-3 font-bold tracking-wider text-gray-600 uppercase lg:mb-2 dark:text-gray-400">
            <p class="lg:hidden block-inline group-hover:text-primary-500">{{ $t('toc.title') }}</p>
            <p class="hidden lg:inline">{{ $t('toc.title') }}</p>
          </span>
          <span class="mr-2 text-xl lg:hidden" aria-label="Toggle table of contents for this page.">
            <FontAwesomeIcon v-if="tocToggle" class="text-gray-700 dark:text-gray-300 group-hover:text-primary-500" :icon="faChevronCircleUp" />
            <FontAwesomeIcon v-else class="text-gray-700 dark:text-gray-300 group-hover:text-primary-500" :icon="faChevronCircleDown" />
          </span>
        </div>
        <div
          class="lg:block"
          :class="{
            block: tocToggle,
            hidden: !tocToggle
          }"
        >
          <scrollactive highlight-first-item active-class="text-primary-500" :offset="0" tag="ul">
            <li v-if="document.title" class="py-2 font-bold text-gray-700 border-t-0 border-dashed dark:text-gray-300 dark:border-gray-800">
              <a href="#document-title" class="block py-0 duration-300 ease-in-out hover:pl-1 scrollactive-item transition-padding">{{ document.title }}</a>
            </li>
            <li
              v-for="link of toc"
              :key="link.id"
              class="text-gray-700 dark:text-gray-300"
              :class="{
                'border-t border-dashed dark:border-gray-800 first:border-t-0': link.depth === 2
              }"
            >
              <a
                :href="`#${link.id}`"
                class="block duration-300 ease-in-out hover:pl-1 scrollactive-item transition-padding"
                :class="{
                  'py-2': link.depth === 2,
                  'ml-2 pb-2': link.depth === 3,
                  'ml-3 pb-2': link.depth === 4,
                  'ml-4 pb-2': link.depth === 5,
                  'ml-5 pb-2': link.depth === 6
                }"
              >{{ link.text }}</a>
            </li>
          </scrollactive>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { faChevronCircleUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons'
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  props: {
    document: {
      type: Object,
      default: () => null
    },
    toc: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tocToggle: false
    }
  },
  computed: {
    ...mapGetters([ 'settings' ]),
    faChevronCircleUp () {
      return faChevronCircleUp
    },
    faChevronCircleDown () {
      return faChevronCircleDown
    }
  }
})
</script>
