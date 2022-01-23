/* eslint-disable no-underscore-dangle */
import consola from 'consola'
import defu from 'defu'
import fs from 'fs-extra'
import path from 'path'

import tailwindConfig from './tailwind.config'

export function themeModule () {
  // wait for nuxt options to be normalized
  const { nuxt } = this
  const { options, hook } = this.nuxt

  // Configure `content/` dir
  options.content.dir = path.resolve(options.rootDir, options.content.dir || 'content')

  // Configure `static/ dir
  options.dir.static = path.resolve(options.rootDir, options.dir.static || 'static')

  // Configure `components/` dir
  hook('components:dirs', async (dirs) => {
    dirs.forEach((d) => consola.info(`Discovered components directory: ${d}`))

    const components = [
      { path: path.resolve(nuxt.options.rootDir, 'components') },
      { path: path.resolve(nuxt.options.rootDir, 'components/global'), global: true },
      { path: path.resolve(__dirname, 'components/app') },
      { path: path.resolve(__dirname, 'components/global/app'), global: true },
      { path: path.resolve(__dirname, 'components/global/base'), global: true },
      { path: path.resolve(__dirname, 'components/global/icons'), global: true }
    ]

    await Promise.all(
      components.map(async (c) => {
        const stat = await fs.stat(c.path).catch(() => null)

        if (stat && stat.isDirectory()) {
          dirs.push(c)

          consola.info(`Adding components directory: ${c.path}`)
        } else {
          nuxt.options.watch.push(c.path)

          consola.info(`Adding component to watch list: ${c.path}`)
        }
      })
    )
  })

  // Configure content after each hook
  hook('content:file:beforeInsert', (document) => {
    const regexp = new RegExp(`^/(${options.i18n.locales.map((locale) => locale.code).join('|')})`, 'gi')
    const dir = document.dir.replace(regexp, '')
    const slug = document.slug.replace(/^index/, '')
    const category = document.category && typeof document.category === 'string' ? document.category : ''

    document.to = `${dir}/${slug}`
    document.category = category
  })

  // Extend `/` route
  hook('build:extendRoutes', (routes) => {
    const allRoutes = routes.find((route) => route.name === 'all')

    routes.push({
      ...allRoutes,
      path: '/',
      name: 'index'
    })
  })

  // Configure `tailwind.config.js` path
  options.tailwindcss.configPath = options.tailwindcss.configPath || path.resolve(options.rootDir, 'tailwind.config.js')
  options.tailwindcss.cssPath = options.tailwindcss.cssPath || path.resolve(options.rootDir, options.dir.assets, 'css', 'tailwind.css')

  // Configure TailwindCSS
  hook('tailwindcss:config', function (defaultTailwindConfig) {
    Object.assign(defaultTailwindConfig, defu(defaultTailwindConfig, tailwindConfig({ nuxt })))
  })

  // Override editor style on dev mode
  if (options.dev) {
    options.css.push(path.resolve(__dirname, 'assets/css/main.dev.css'))

    consola.warn('Running in development mode added extra options.')
  }
}
