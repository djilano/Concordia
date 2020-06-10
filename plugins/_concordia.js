/**
 * - WebSQL with a Promisified localStorage-like interface (Concordia.storage.getItem/setItem)
 * - Global helpers
 * - Hook into URL changes
 */

window.Concordia = {
  storage: {
    db: null,

    getItem: (item) => {
      return new Promise((resolve, reject) => {
        if (!window.Concordia.storage.db) return reject()
        window.Concordia.storage.db.transaction(function (tx) {
          tx.executeSql(
            'SELECT * FROM settings WHERE id=? LIMIT 1',
            [item],
            function (tx, results) {
              if (!results.rows.length) return reject()
              return resolve(results.rows.item(0).value)
            }
          )
        })
      })
    },

    setItem: (item, value) => {
      window.Concordia.storage.db.transaction(function (tx) {
        tx.executeSql(
          'INSERT OR IGNORE INTO settings (id, value) VALUES (?, ?)',
          [item, value]
        )
        tx.executeSql('UPDATE settings SET value = ? WHERE id = ?', [
          value,
          item,
        ])
      })
    },
  },

  isUserHome() {
    return document.location.pathname.startsWith('/channels/@me')
  },

  delay(ms = 0) {
    return new Promise((res) => setTimeout(res, ms))
  },

  testUtil() {
    console.log('Hi from Concordia Test Util!')
  },
}

// Setup storage
window.Concordia.storage.db = openDatabase(
  'concordia',
  '1.0',
  'Concordia DB',
  2 * 1024 * 1024
)
window.Concordia.storage.db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS settings (id unique, value)')
})

// Hook into history
var pushState = history.pushState
history.pushState = function (state) {
  pushState.apply(history, arguments)

  if (typeof history.onpushstate === 'function') {
    history.onpushstate({ state: state })
  }
}

var popState = history.popState
history.popState = function (state) {
  popState.apply(history, arguments)

  if (typeof history.onpopstate === 'function') {
    history.onpopstate({ state: state })
  }
}
