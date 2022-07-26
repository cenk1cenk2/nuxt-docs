<template>
  <div class="flex overflow-hidden justify-center items-center mx-auto mb-6 w-full text-3xl text-center text-white bg-black rounded-md codesandbox">
    <iframe
      v-if="isIntersecting && src"
      :src="src"
      title="CodeSandbox editor"
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      class="overflow-hidden w-full"
    />
    <span v-else>Loading CodeSandbox...</span>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
/* eslint-disable no-underscore-dangle */
export default defineComponent({
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isIntersecting: false
    }
  },
  mounted () {
    if (!window.IntersectionObserver) {
      this.isIntersecting = true

      return
    }

    this.__observer = new window.IntersectionObserver((entries) => {
      entries.forEach(({ intersectionRatio, target: el }) => {
        if (intersectionRatio > 0) {
          this.isIntersecting = true
          this.__observer.disconnect()
          delete this.__observer
        }
      })
    })
    this.__observer.observe(this.$el)
  },
  beforeDestroy () {
    if (this.__observer) {
      this.__observer.disconnect()
      delete this.__observer
    }
  }
})
</script>

<style lang="postcss" scoped>
.codesandbox,
.codesandbox iframe {
  @apply w-full rounded-md overflow-hidden h-64;

  height: 500px;
}
</style>
