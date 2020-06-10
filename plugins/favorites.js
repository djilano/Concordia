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
          const $userEl = await this.getConversationElement(id)
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

  async getConversationElement(id) {
    const $scroller = this.$channels.parentNode
    const stepSize = $scroller.clientHeight
    const maxSteps = Math.ceil(this.$channels.clientHeight / stepSize)
    for (let i = 0; i <= maxSteps; i++) {
      $scroller.scrollTop = i * stepSize
      await Concordia.delay()
      const $el = this.$channels.querySelector(
        `a[class^="channel-"][href$="${id}"]`
      )
      if ($el) return $el
    }

    throw new Error('Conversation not found!')
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
      const $starSVG = `<svg class="icon-favorite--star" viewBox="0 0 24 24"><path fill="" d="M21.924 8.61789C21.77 8.24489 21.404 8.00089 21 8.00089H15.618L12.894 2.55389C12.555 1.87689 11.444 1.87689 11.105 2.55389L8.38199 8.00089H2.99999C2.59599 8.00089 2.22999 8.24489 2.07599 8.61789C1.92199 8.99089 2.00699 9.42289 2.29299 9.70789L6.87699 14.2919L5.03899 20.7269C4.92399 21.1299 5.07199 21.5619 5.40999 21.8089C5.74999 22.0569 6.20699 22.0659 6.55399 21.8329L12 18.2029L17.445 21.8329C17.613 21.9449 17.806 22.0009 18 22.0009C18.207 22.0009 18.414 21.9369 18.59 21.8089C18.928 21.5619 19.076 21.1299 18.961 20.7269L17.123 14.2919L21.707 9.70789C21.993 9.42289 22.078 8.99089 21.924 8.61789Z"></path></svg>`
      $testEl.classList.add('favorites-header')
      $testEl.innerText = 'Favorites'
      this.$el.insertAdjacentHTML('beforeend', $starSVG)
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
