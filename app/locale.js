/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const L20n = require('l20n')
const path = require('path')
const ipcMain = require('electron').ipcMain

// Exhaustive list of identifiers used by top and context menus
var menuIdentifiers = () => {
  return [
    'downloadsManager',
    'confirmClearPasswords',
    'about',
    'quit',
    'addToReadingList',
    'viewPageSource',
    'copyImageAddress',
    'openImageInNewTab',
    'saveImage',
    'copyLinkAddress',
    'openInNewSessionTab',
    'openInNewPrivateTab',
    'openInNewTab',
    'openAllInTabs',
    'disableAdBlock',
    'disableTrackingProtection',
    'muteTab',
    'unmuteTab',
    'pinTab',
    'unpinTab',
    'deleteFolder',
    'deleteBookmark',
    'editFolder',
    'editBookmark',
    'unmuteTabs',
    'muteTabs',
    'addBookmark',
    'addFolder',
    'newTab',
    'closeTab',
    'bookmarkPage',
    'openFile',
    'openLocation',
    'openSearch',
    'importFrom',
    'closeWindow',
    'savePageAs',
    'spreadTheWord',
    'share',
    'undo',
    'redo',
    'cut',
    'copy',
    'paste',
    'pasteWithoutFormatting',
    'delete',
    'selectAll',
    'findNext',
    'findPrevious',
    'file',
    'edit',
    'view',
    'actualSize',
    'zoomIn',
    'zoomOut',
    'toolbars',
    'reloadPage',
    'reloadTab',
    'cleanReload',
    'readingView',
    'tabManager',
    'textEncoding',
    'toggleDeveloperTools',
    'toggleBrowserConsole',
    'toggleFullScreenView',
    'home',
    'back',
    'forward',
    'reopenLastClosedWindow',
    'showAllHistory',
    'clearHistory',
    'bookmarks',
    'addToFavoritesBar',
    'window',
    'minimize',
    'zoom',
    'selectNextTab',
    'selectPreviousTab',
    'moveTabToNewWindow',
    'mergeAllWindows',
    'downloads',
    'history',
    'bringAllToFront',
    'help',
    'sendUsFeedback',
    'services',
    'hideOthers',
    'showAll',
    'newPrivateTab',
    'newSessionTab',
    'newWindow',
    'reopenLastClosedTab',
    'print',
    'findOnPage',
    'checkForUpdates',
    'preferences',
    'bookmarksManager',
    'importBookmarks',
    'reportAnIssue',
    'submitFeedback',
    'bookmarksToolbar',
    'bravery',
    'replaceAds',
    'blockAds',
    'allowAdsAndTracking',
    'block3rdPartyCookie',
    'blockPopups',
    'httpsEverywhere'
  ]
}

var ctx = null
var translations = {}
var lang = 'en-US'

// Return a translate token from cache or a placeholder
// indicating that no translation is available
exports.translation = (token) => {
  if (translations[token]) {
    return translations[token]
  } else {
    // This will return an identifier in upper case enclosed in square brackets
    // Useful for determining if a translation was not requested in the menu
    // identifiers above.
    return `[${token.toUpperCase()}]`
  }
}

// Initialize translations for a language providing an optional
// callback executed after the translation caching process
// is complete.
exports.init = (language, cb) => {
  // Default to noop callback
  cb = cb || function () {}

  // Currently selected language identifier I.e. 'en-US'
  lang = language

  // Languages to support - TODO retrieve this dynamically
  const langs = [
    { code: 'en-US' },
    { code: 'nl-NL' },
    { code: 'pt-BR' },
    { code: 'bn-BD' }
  ]

  // Property files to parse (only ones containing menu specific identifiers)
  const propertyFiles = [
    path.join(__dirname, 'locales', lang, 'menu.properties'),
    path.join(__dirname, 'locales', lang, 'app.properties'),
    path.join(__dirname, 'locales', lang, 'password.properties')
  ]

  // If langs change a new context must be created
  const env = new L20n.Env(L20n.fetchResource)
  ctx = env.createContext(langs, propertyFiles)

  // Translate the menu identifiers
  var identifiers = menuIdentifiers()
  ctx.formatValues.apply(ctx, identifiers).then((values) => {
    // Cache the translations for later retrieval
    values.forEach((value, idx) => {
      translations[identifiers[idx]] = value
    })
    // Signal when complete
    cb(translations)
  })
}

// If this is in the main process
if (ipcMain) {
  // Respond to requests for translations from the renderer process
  ipcMain.on('translations', (event, arg) => {
    // Return the entire set of translations synchronously
    event.returnValue = translations
  })
}