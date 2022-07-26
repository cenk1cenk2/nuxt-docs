import marked, { Renderer } from 'marked'

// eslint-disable-next-line no-unused-vars
export default function ({ app }, inject) {
  const renderer = new Renderer()

  renderer.link = function (href, title, text) {
    return title ? '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>' : '<a target="_blank" href="' + href + '">' + text + '</a>'
  }

  const compile = (markdown) => {
    if (!markdown) {
      return
    }

    return marked(markdown, { renderer })
  }

  inject('markdown', compile)
}
