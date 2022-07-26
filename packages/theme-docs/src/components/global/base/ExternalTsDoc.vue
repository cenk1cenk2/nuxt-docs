<template>
  <div>
    <div>
      <div v-if="markdown" class="border-2 border-gray-200 dark:border-gray-800">
        <NuxtContent :document="markdown" class="px-2 leading-tight md:px-4 tight-hr"></NuxtContent>
      </div>
      <div v-else>
        <Alert type="danger">Can not load external markdown file. Please visit to direct <a :href="src">link</a>.</Alert>
      </div>
    </div>
  </div>
</template>

<script>
import { getDefaults, processMarkdownOptions } from '@nuxt/content/lib/utils'
import Markdown from '@nuxt/content/parsers/markdown'
import { defineComponent, useContext, useStatic, computed } from '@nuxtjs/composition-api'
import md5 from 'md5'
import remarkBehead from 'remark-behead'
import remarkUnlink from 'remark-unlink'
import findAfter from 'unist-util-find-after'
// eslint-disable-next-line import/default
import visitParents from 'unist-util-visit-parents'

export default defineComponent({
  props: {
    src: {
      type: String,
      required: true
    },
    behead: {
      type: String,
      default: '0'
    },
    pick: {
      type: String,
      default: 'Methods,Properties,Enumeration members'
    }
  },
  setup (props) {
    const behead = parseInt(props.behead, 10)
    const pick = props.pick.split(',')

    const { $axios, params } = useContext()

    const id = computed(() => params.value.id)

    const markdown = useStatic(
      async () => {
        let res

        try {
          res = await $axios.get(props.src)
        } catch {
          return
        }

        if (res.status !== 200) {
          return
        }

        const options = getDefaults()

        processMarkdownOptions(options)

        options.markdown.tocDepth = 0

        if (behead !== 0) {
          options.markdown.remarkPlugins.push({
            options: { after: 0, depth: behead },
            name: 'remark-behead',
            instance: remarkBehead
          })
        }

        // remove unnessary plugins
        options.markdown.remarkPlugins = options.markdown.remarkPlugins.reduce((o, plugin) => {
          if (!['remark-autolink-headings', 'remark-slug'].includes(plugin.name)) {
            return [...o, plugin]
          }

          return o
        }, [])

        // drop links

        options.markdown.remarkPlugins.push({
          options: {},
          name: 'remark-unlink',
          instance: remarkUnlink
        })

        if (pick.length > 0) {
          options.markdown.remarkPlugins.push({
            options: {},
            name: 'remark-pick',
            instance: () => (tree) => {
              const sections = []

              for (let depth = 6; depth > 0; depth--) {
                visitParents(
                  tree,
                  node => node.type === 'heading' && node.depth === depth,
                  (node, ancestors) => {
                    const start = node
                    const depth = start.depth
                    const parent = ancestors[ancestors.length - 1]

                    const isEnd = node => (node.type === 'heading' && node.depth <= depth) || node.type === 'export'
                    const end = findAfter(parent, start, isEnd)

                    const startIndex = parent.children.indexOf(start)
                    const endIndex = parent.children.indexOf(end)

                    const between = parent.children.slice(startIndex, endIndex > 0 ? endIndex : undefined)

                    const firstChild = between?.[0]?.children

                    if (firstChild && firstChild.some(child => pick.includes(child.value))) {
                      sections.push(between)
                    }
                  }
                )
              }

              tree.children = sections.flatMap(i => i)
            }
          })
        }

        const parsedMarkdown = await new Markdown(options.markdown).toJSON(res.data)

        return parsedMarkdown
      },
      id,
      md5(props.src + JSON.stringify(props))
    )

    return {
      markdown,
      toggle: false
    }
  }
})
</script>

<style lang="postcss">
.tight-hr hr {
  margin-bottom: 0.75em;
  margin-top: 0.2em;
}
</style>
