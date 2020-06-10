/**
 * Stop the mouse from selecting an emote until you actually move it
 */

let $currentTextArea = null
let autoCompleteIsOpen = false
let observer = new MutationObserver(onTextAreaTreeChange)

async function waitForElement(selector) {
  const $el = document.querySelector(selector)
  if ($el) return $el
  await Concordia.delay(250)
  return waitForElement(selector)
}

async function waitForNewElement(selector) {
  const $el = document.querySelector(selector)
  if ($el !== $currentTextArea) return $el
  await Concordia.delay(250)
  return waitForNewElement(selector)
}

function findAutocomplete(nodes) {
  return [...nodes].find(($el) => $el.className.startsWith('autocomplete-'))
}

async function onNodeAdded(mutation) {
  const $autoComplete = findAutocomplete(mutation.addedNodes)
  if ($autoComplete) {
    $autoComplete.style.pointerEvents = 'none'
    autoCompleteIsOpen = true
  }
}

async function onNodeRemoved(mutation) {
  const $autoComplete = findAutocomplete(mutation.removedNodes)
  if ($autoComplete) {
    autoCompleteIsOpen = false
  }
}

function onTextAreaTreeChange(mutations, observer) {
  for (let mutation of mutations) {
    if (mutation.removedNodes.length) onNodeRemoved(mutation)
    if (mutation.addedNodes.length) onNodeAdded(mutation)
  }
}

async function setup() {
  if ($currentTextArea) {
    observer.observe($currentTextArea, { childList: true })
  }

  $currentTextArea = await waitForNewElement('div[class^="channelTextArea-"]')
  observer.disconnect()
  return setup()
}

document.addEventListener('mousemove', async (e) => {
  if (!autoCompleteIsOpen) return
  const $autoComplete = await waitForElement('div[class^="autocomplete-"]')
  if ($autoComplete.style.pointerEvents === 'none') {
    $autoComplete.style.pointerEvents = 'all'
  }
})

setup()
