import uuid from 'uuid-random'
import * as crypto from './crypto'

export const loadKey = (keyId, password) => {
  const localKey = JSON.parse(global.localStorage.getItem(`key-${keyId}`))
  if (!localKey.raw && !password) {
    throw new Error('password-required')
  }
  return crypto.importKey(localKey, password)
}
export const loadExportedKeys = () =>
  Object.keys(global.localStorage)
    .filter((key) => key.slice(0, 3) === 'key')
    .map((key) => JSON.parse(global.localStorage.getItem(key)))
    .sort((a, b) => a.id - b.id)

export const generateKey = async (password) => {
  const { raw, salt } = password
    ? await crypto.generatePasswordKey(password)
    : await crypto.generateKey()
  const exportedKeyRaw = password ? null : await crypto.exportKeyRaw(raw)
  const id = uuid().replace(/-/g, '')
  const key = { id, raw, salt }
  const exportedKey = JSON.stringify({
    id,
    raw: exportedKeyRaw,
    salt: salt && [...salt]
  })
  return { key, exportedKey }
}
export const importKey = (key) => {
  const parsedKey = JSON.parse(key)
  global.localStorage.setItem(`key-${parsedKey.id}`, key)
  return parsedKey
}
export const importKeyLink = (keyB64) => {
  return importKey(global.atob(keyB64))
}

export const makeKeyLink = (exportedKey) =>
  `${global.location.origin}/keys#${global.btoa(exportedKey)}`
