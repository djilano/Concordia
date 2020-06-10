;(() => {
  getConcordiaScripts((file, code) => {
    console.log('[Concordia] Got script:', file)
    if (/\.js$/.test(file)) {
      // Don't tell the JS gods
      eval('(()=>{' + code + '})();')
    } else if (/\.css$/.test(file)) {
      const style = document.createElement('style')
      style.id = file.split('.')[0]
      style.innerHTML = code
      document.head.appendChild(style)
    }
  })
})()
