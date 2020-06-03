import * as crypto from './crypto'

export const operationSeparator = '-'

const filterDuplicates = (cards) =>
  cards.filter(
    (card, index) =>
      card && !cards.slice(index + 1).find(({ id }) => id === card.id)
  )

export default (state, setState) => {
  const operations = {
    generateKey: async () => {
      const key = await crypto.generateKey()
      const exportedKey = JSON.stringify(await crypto.exportKey(key))
      global.localStorage.setItem('key', exportedKey)
      setState('key', key)
      setState('exportedKey', exportedKey)
      setState('mode', 'setup')
      setState('notification', 'New key generated')
      return JSON.stringify(key)
    },
    handleSetupCards: (cards) => {
      const newCards = cards
        .map((card) => ({ ...card, amount: decodeURIComponent(card.amount) }))
        .reverse()
      setState('cards', newCards)
      global.localStorage.setItem('cards', JSON.stringify(newCards))
      setState('mode', 'default')
      window.location.hash = ''
    },
    importKey: (keyB64) => {
      const decodedKey = global.atob(keyB64)
      global.localStorage.setItem('key', decodedKey)
      setState('notification', 'New key imported')
      window.location.hash = ''
    },
    addCard: (barcode, number, pin, amount, id) => {
      const cards = (
        JSON.parse(global.localStorage.getItem('cards')) || []
      ).filter(Boolean)
      const newCard = {
        barcode,
        number,
        pin,
        amount: decodeURIComponent(amount),
        id,
        used: false
      }
      const newCards = filterDuplicates([newCard].concat(cards || []))
      global.localStorage.setItem('cards', JSON.stringify(newCards))
      setState('notification', 'Added card')
      operations.loadCards()
      operations.loadKey()
      window.location.hash = ''
    },
    loadCards: () => {
      const cards = filterDuplicates(
        JSON.parse(global.localStorage.getItem('cards')) || []
      )
      setState('cards', cards)
    },
    loadKey: async () => {
      const localKey = global.localStorage.getItem('key')
      const key = await crypto.importKey(JSON.parse(localKey))
      setState('key', key)
    },
    encryptCards: async (key, cards) =>
      Promise.all(
        cards.map(async ({ barcode, number, pin, amount, id }) => ({
          barcode: await crypto.encryptEncode(key, barcode),
          number: await crypto.encryptEncode(key, number),
          pin: await crypto.encryptEncode(key, pin),
          amount: encodeURIComponent(amount),
          id
        }))
      ),
    decryptCard: async (key, card) => ({
      id: card.id,
      barcode: await crypto.decryptDecode(key, card.barcode),
      number: await crypto.decryptDecode(key, card.number),
      pin: await crypto.decryptDecode(key, card.pin),
      amount: card.amount,
      used: card.used
    }),
    toggleUsedCard: (targetId) => {
      setState(
        'cards',
        ({ id }) => id === targetId,
        'used',
        (used) => !used
      )
      if (state.openCard && state.openCard.id === targetId) {
        setState('openCard', 'used', (used) => !used)
      }
      global.localStorage.setItem('cards', JSON.stringify(state.cards))
    }
  }
  return operations
}
