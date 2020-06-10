const $sb = document.querySelector('div[class^="sidebar-"]')
$sb.style.transition = 'width 0.2s'
document.addEventListener(
  'keyup',
  (e) => {
    if (e.ctrlKey && e.key === 's')
      $sb.style.width = $sb.clientWidth > 0 ? 0 : '240px'
  },
  false
)
