import * as crypto from './crypto'

export const loadCard = (cardId) =>
  JSON.parse(global.localStorage.getItem(`card-${cardId}`))
export const loadCards = ({
  sort = 'id',
  sortDirection = -1,
  filter = Boolean
} = {}) =>
  Object.keys(global.localStorage)
    .filter((key) => key.slice(0, 4) === 'card')
    .map((key) => JSON.parse(global.localStorage.getItem(key)))
    .filter(filter)
    .sort((a, b) => (a[sort] - b[sort]) * sortDirection)
export const updateCard = (id, mutate) => {
  const card = JSON.parse(global.localStorage.getItem(`card-${id}`))
  const newCard = mutate(card)
  global.localStorage.setItem(`card-${id}`, JSON.stringify(newCard))
  return newCard
}

const encryptEncode = async (key, data) =>
  global.btoa(
    JSON.stringify(
      (await crypto.encrypt(key, String(data))).map((data) => [...data])
    )
  )
const decryptDecode = (key, data) =>
  crypto.decrypt(
    key,
    JSON.parse(global.atob(data)).map((values) => new Uint8Array(values))
  )

export const encryptCards = (key, cards, password) => {
  const keyId = key.id
  return Promise.all(
    cards.map(async ({ barcode, number, pin, amount, currency, id }) => ({
      barcode: barcode && (await encryptEncode(key, barcode, password)),
      number: number && (await encryptEncode(key, number, password)),
      pin: pin && (await encryptEncode(key, pin, password)),
      amount: encodeURIComponent(amount || ''),
      currency: encodeURIComponent(currency || ''),
      id,
      keyId
    }))
  )
}
export const decryptCard = async (key, card, password) => ({
  ...card,
  barcode: card.barcode && (await decryptDecode(key, card.barcode, password)),
  number: card.number && (await decryptDecode(key, card.number, password)),
  pin: card.pin && (await decryptDecode(key, card.pin, password))
})

export const importCards = (cards) => {
  const now = new Date()
  cards
    .map((card) => ({
      ...card,
      amount: decodeURIComponent(card.amount || ''),
      currency: decodeURIComponent(card.currency || ''),
      id: decodeURIComponent(card.id),
      createdAt: now,
      notes: []
    }))
    .forEach((card) => {
      global.localStorage.setItem(`card-${card.id}`, JSON.stringify(card))
    })
}
export const cardLinkSeparator = '-'
export const makeCardLink = ({
  barcode,
  number,
  pin,
  amount,
  currency,
  id,
  keyId
}) =>
  `${global.location.origin}/cards#${[
    barcode,
    number,
    pin,
    amount,
    currency,
    id,
    keyId
  ].join(cardLinkSeparator)}`
export const importLinkCard = (hash) => {
  const [barcode, number, pin, amount, currency, id, keyId] = hash.split(
    cardLinkSeparator
  )
  const newCard = {
    barcode,
    number,
    pin,
    amount: decodeURIComponent(amount || ''),
    currency: decodeURIComponent(currency || ''),
    id: decodeURIComponent(id),
    keyId,
    used: false,
    createdAt: new Date(),
    notes: []
  }
  global.localStorage.setItem(`card-${id}`, JSON.stringify(newCard))
  return newCard
}
