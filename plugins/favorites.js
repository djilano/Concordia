/**
 * Adds ability to sticky favorite conversations by double clicking on them
 */

class Favorites {
  constructor() {
    this.$el = null
    this.$searchBar = null
    this.$channels = null
    this.observer = null
    this.favorites = []
    this.favoritesHtml = {}

    this.init()
  }

  async init() {
    this.updateElements()
    this.favorites = await this.loadSavedFavorites()
    this.initClickHandler()
    this.initObserver()
    this.render()
  }

  updateElements() {
    this.$searchBar = document.querySelector('div[class^="searchBar-"]')
    this.$channels = document.getElementById('private-channels')
  }

  initClickHandler() {
    document.addEventListener('dblclick', (e) => {
      const $user = e.target.closest('a')
      if (!$user || !$user.id || !$user.id.startsWith('private-channels'))
        return

      const id = this.getConversationId($user.href)
      if (this.isFavorite(id)) this.removeFavorite(id)
      else this.addFavorite(id)
      this.render(true)
    })
  }

  initObserver() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    const observerConfig = { attributes: true, childList: true, subtree: true }
    const debouncedObserver = _.throttle(this.updateInfo.bind(this), 500)
    this.observer = new MutationObserver(debouncedObserver)
    this.observer.observe(this.$channels, observerConfig)
  }

  updateInfo() {
    this.$channels.querySelectorAll('a[class^="channel-"]').forEach(($el) => {
      const id = this.getConversationId($el.href)
      if (!this.isFavorite(id)) return

      const clone = $el.cloneNode(true)
      clone.addEventListener(
        'click',
        async (e) => {
          e.preventDefault()
          // TODO: loop until we find the convo?
          this.$channels.parentNode.scrollTop = 0
          await Concordia.delay()
          const $userEl = this.getConversationElement(id)
          if ($userEl) $userEl.click()
        },
        false
      )
      this.favoritesHtml[id] = clone
    })
    this.render(true)
  }

  async loadSavedFavorites() {
    try {
      return JSON.parse(await Concordia.storage.getItem('favorites'))
    } catch {
      return []
    }
  }

  getConversationId(url) {
    return new URL(url).pathname.split('/').pop()
  }

  getConversationElement(id) {
    return this.$channels.querySelector(`a[class^="channel-"][href$="${id}"]`)
  }

  isFavorite(id) {
    return this.favorites.includes(id)
  }

  addFavorite(id) {
    this.favorites.push(id)
    this.saveFavorites()
  }

  removeFavorite(id) {
    this.favorites = this.favorites.filter((item) => item !== id)
    this.saveFavorites()
  }

  saveFavorites() {
    Concordia.storage.setItem('favorites', JSON.stringify(this.favorites))
  }

  render(reload = false) {
    if (!Concordia.isUserHome()) return

    if (reload && this.$el) {
      this.$el.remove()
      this.$el = null
    }

    if (!this.$el) {
      this.$el = document.createElement('div')
      this.$el.classList.add('favorites-wrapper')

      const $testEl = document.createElement('h2')
      $testEl.classList.add('favorites-header')
      $testEl.innerText = 'Favorites'
      this.$el.appendChild($testEl)
    }

    // add favorites
    if (this.favorites.length && Object.keys(this.favoritesHtml).length < 1) {
      this.updateInfo()
    }

    this.favorites.forEach((id) => {
      if (!(id in this.favoritesHtml)) return

      this.$el.insertAdjacentElement('beforeend', this.favoritesHtml[id])
    })

    this.$searchBar.insertAdjacentElement('afterend', this.$el)
  }
}

const favs = new Favorites()
window.history.onpushstate = async (e) => {
  if (Concordia.isUserHome()) {
    await Concordia.delay()
    favs.updateElements()
    favs.initObserver()
    favs.render(true)
  }
}
