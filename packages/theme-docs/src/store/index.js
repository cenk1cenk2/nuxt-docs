import defu from 'defu'
import groupBy from 'lodash.groupby'
import Vue from 'vue'

export const state = () => ({
  categories: {},
  releases: [],
  settings: {
    title: 'Nuxt Content Docs',
    url: '',
    defaultDir: 'docs',
    defaultBranch: '',
    filled: false
  }
})

export const getters = {
  settings (state) {
    return state.settings
  },
  githubUrls (state) {
    const { github, githubApi, githubDocs } = state.settings

    let parsed

    // GitHub Enterprise
    if (github.startsWith('http') && githubApi.startsWith('http')) {
      parsed = {
        repo: github,
        api: {
          repo: githubApi,
          releases: `${githubApi}/releases`
        }
      }
    } else {
      // GitHub
      parsed = {
        repo: `https://github.com/${github}`,
        api: {
          repo: `https://api.github.com/repos/${github}`,
          releases: `https://api.github.com/repos/${github}/releases`
        }
      }
    }

    if (githubDocs?.repo?.startsWith('http')) {
      parsed = {
        ...parsed,
        docs: {
          repo: githubDocs.repo,
          branch: githubDocs.branch,
          prefix: githubDocs.prefix
        }
      }
    } else {
      parsed = {
        ...parsed,
        docs: {
          repo: `https://github.com/${githubDocs.repo}`,
          branch: githubDocs.branch,
          prefix: githubDocs.prefix
        }
      }
    }

    return parsed
  },
  npmUrls (state) {
    const { npm } = state.settings

    if (npm.startsWith('http')) {
      return {
        repo: npm
      }
    } else {
      return {
        repo: `https://www.npmjs.com/package/${npm}`
      }
    }
  },
  releases (state) {
    return state.releases
  },
  lastRelease (state) {
    return state.releases[0]
  }
}

export const mutations = {
  SET_CATEGORIES (state, categories) {
    // Vue Reactivity rules since we add a nested object
    Vue.set(state.categories, this.$i18n.locale, categories)
  },
  SET_RELEASES (state, releases) {
    state.releases = releases
  },
  SET_DEFAULT_BRANCH (state, branch) {
    state.settings.defaultBranch = branch
  },
  SET_SETTINGS (state, settings) {
    state.settings = defu({ filled: true }, settings, state.settings)

    if (!state.settings.url) {
      // eslint-disable-next-line no-console
      console.warn('Please provide the `url` property in `content/setting.json`')
    }
  }
}

export const actions = {
  async fetchCategories ({ commit, state }) {
    // Avoid re-fetching in production
    if (process.dev === false && state.categories[this.$i18n.locale]) {
      return
    }
    const docs = await this.$content(this.$i18n.locale, { deep: true }).only([ 'title', 'menuTitle', 'category', 'slug', 'version', 'to' ]).sortBy('position', 'asc').fetch()

    if (state.releases.length > 0) {
      docs.push({
        slug: 'releases',
        title: 'Releases',
        category: 'Community',
        to: '/releases'
      })
    }
    const categories = groupBy(docs, 'category')

    commit('SET_CATEGORIES', categories)
  },
  async fetchReleases ({ commit, state, getters }) {
    if (!state.settings.github) {
      return
    }

    const options = {}

    if (this.$config.githubToken) {
      options.headers = { Authorization: `token ${this.$config.githubToken}` }
    }
    let releases = []

    try {
      const data = await fetch(getters.githubUrls.api.releases, options)
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText)
          }

          return res
        })
        .then((res) => res.json())

      releases = data
        .filter((r) => !r.draft && !r.prerelease)
        .map((release) => {
          return {
            name: (release.name || release.tag_name).replace('Release ', ''),
            date: release.published_at,
            body: this.$markdown(release.body)
          }
        })
      // eslint-disable-next-line no-empty
    } catch (e) {}

    const getMajorVersion = (r) => r.name && Number(r.name.substring(1, 2))

    releases.sort((a, b) => {
      const aMajorVersion = getMajorVersion(a)
      const bMajorVersion = getMajorVersion(b)

      if (aMajorVersion !== bMajorVersion) {
        return bMajorVersion - aMajorVersion
      }

      return new Date(b.date) - new Date(a.date)
    })

    commit('SET_RELEASES', releases)
  },
  async fetchDefaultBranch ({ commit, state, getters }) {
    if (!state.settings.github || state.settings.defaultBranch) {
      return
    }

    const options = {}

    if (this.$config.githubToken) {
      options.headers = { Authorization: `token ${this.$config.githubToken}` }
    }
    let defaultBranch

    try {
      const data = await fetch(getters.githubUrls.api.repo, options)
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText)
          }

          return res
        })
        .then((res) => res.json())

      defaultBranch = data.default_branch
      // eslint-disable-next-line no-empty
    } catch (e) {}

    commit('SET_DEFAULT_BRANCH', defaultBranch || 'main')
  },
  async fetchSettings ({ commit }) {
    try {
      // eslint-disable-next-line no-unused-vars
      const { dir, extension, path, slug, to, createdAt, updatedAt, ...settings } = await this.$content('settings').fetch()

      commit('SET_SETTINGS', settings)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('You can add a `settings.json` file inside the `content/` folder to customize this theme.')
    }
  }
}
