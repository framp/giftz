import * as crypto from './crypto'

export const loadCard = (cardId) =>
  JSON.parse(global.localStorage.getItem(`card-${cardId}`))
export const loadCards = () =>
  Object.keys(global.localStorage)
    .filter((key) => key.slice(0, 4) === 'card')
    .map((key) => JSON.parse(global.localStorage.getItem(key)))
    .sort((a, b) => a.id - b.id)
export const toggleUsedCard = (id) => {
  const card = JSON.parse(global.localStorage.getItem(`card-${id}`))
  card.used = !card.used
  global.localStorage.setItem(`card-${id}`, JSON.stringify(card))
  return card
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
    cards.map(async ({ barcode, number, pin, amount, id }) => ({
      barcode: barcode && (await encryptEncode(key, barcode, password)),
      number: number && (await encryptEncode(key, number, password)),
      pin: pin && (await encryptEncode(key, pin, password)),
      amount: encodeURIComponent(amount),
      id,
      keyId
    }))
  )
}
export const decryptCard = async (key, card, password) => ({
  id: card.id,
  barcode: card.barcode && (await decryptDecode(key, card.barcode, password)),
  number: card.number && (await decryptDecode(key, card.number, password)),
  pin: card.pin && (await decryptDecode(key, card.pin, password)),
  amount: card.amount,
  used: card.used
})

export const importCards = (cards) => {
  cards
    .map((card) => ({
      ...card,
      amount: decodeURIComponent(card.amount),
      id: decodeURIComponent(card.id)
    }))
    .forEach((card) => {
      global.localStorage.setItem(`card-${card.id}`, JSON.stringify(card))
    })
}
export const cardLinkSeparator = '-'
export const makeCardLink = ({ barcode, number, pin, amount, id, keyId }) =>
  `${global.location.origin}/cards#${[
    barcode,
    number,
    pin,
    amount,
    id,
    keyId
  ].join(cardLinkSeparator)}`
export const importLinkCard = (hash) => {
  const [barcode, number, pin, amount, id, keyId] = hash.split(
    cardLinkSeparator
  )
  const newCard = {
    barcode,
    number,
    pin,
    amount: decodeURIComponent(amount),
    id: decodeURIComponent(id),
    keyId,
    used: false
  }
  global.localStorage.setItem(`card-${id}`, JSON.stringify(newCard))
  return newCard
}
