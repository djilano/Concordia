const searchBar = document.querySelector('div[class^="searchBar-"]'),
  favH2 = `<h2 class="privateChannelsHeaderContainer-3NB1K1 container-2ax-kl" style="color: #ffdc23ba">Favorites</h2>`,
  wrapper = `<div class="cstm-wrapper" style="height: 42px"></div>`,
  privChannel = document.getElementById('private-channels'),
  config = { attributes: true, childList: true, subtree: true },
  observer = new MutationObserver((mutationList, observer) => {
    removeClones()
  })

let favoriteChat, isScrolling

observer.observe(privChannel, config)

let checkConversations = (conversations) => {
  conversations.forEach((conv) => {
    if (conv.href == 'https://discordapp.com/channels/@me/238749395258966017') {
      let clone = conv.cloneNode(true)
      favoriteChat = clone

      if (!document.querySelector('.cstm-wrapper')) {
        searchBar.insertAdjacentHTML('afterend', wrapper)
        document
          .querySelector('.cstm-wrapper')
          .insertAdjacentHTML('beforebegin', favH2)
      }

      document
        .querySelector('.cstm-wrapper')
        .insertAdjacentElement('beforeend', clone)
      clone.style.backgroundColor = '#ffdc23ba'

      clone.addEventListener(
        'click',
        (e) => {
          e.preventDefault()
          conv.click()
        },
        false
      )
    }
  })
}

let removeClones = () => {
  favoriteChat.remove()
  checkConversations(document.querySelectorAll('a[class^="channel-"]'))
}

checkConversations(document.querySelectorAll('a[class^="channel-"]'))
