<template>
  <div
    v-if="prev || next"
    class="grid grid-cols-2 gap-2 pt-4 border-t lg:px-8 dark:border-gray-800"
    :class="{
      'lg:border-t-0': settings.layout === 'single'
    }"
  >
    <NuxtLink v-if="prev" :to="localePath(prev.to)" class="flex justify-start items-center font-bold hover:underline text-primary-500">
      <FontAwesomeIcon :icon="faLongArrowAltLeft" class="flex-shrink-0 mr-2 w-4 h-4" />
      <span class="truncate">{{ prev.title }}</span>
    </NuxtLink>
    <span v-else>&nbsp;</span>

    <NuxtLink v-if="next" :to="localePath(next.to)" class="flex justify-end items-center font-bold hover:underline text-primary-500">
      <span class="truncate">{{ next.title }}</span>
      <FontAwesomeIcon :icon="faLongArrowAltRight" class="flex-shrink-0 ml-2 w-4 h-4" />
    </NuxtLink>
    <span v-else>&nbsp;</span>
  </div>
</template>

<script>
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  props: {
    prev: {
      type: Object,
      default: () => null
    },
    next: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    ...mapGetters(['settings']),
    faLongArrowAltLeft () {
      return faLongArrowAltLeft
    },
    faLongArrowAltRight () {
      return faLongArrowAltRight
    }
  }
})
</script>
