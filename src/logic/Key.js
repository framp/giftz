import uuid from 'uuid-random'
import * as crypto from './crypto'

export const loadKey = (keyId, password, cryptoInstance = true) => {
  const localKey = JSON.parse(global.localStorage.getItem(`key-${keyId}`))
  if (!localKey || !cryptoInstance) {
    return localKey
  }
  if (!localKey.raw && !password) {
    throw new Error('password-required')
  }
  return crypto.importKey(localKey, password)
}
export const deleteKey = (keyId) => {
  global.localStorage.removeItem(`key-${keyId}`)
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
  const exportedKey = {
    id,
    raw: exportedKeyRaw,
    salt: salt && [...salt]
  }
  return { key, exportedKey }
}
export const importKey = (key) => {
  const newKey = {
    ...key,
    createdAt: new Date()
  }
  global.localStorage.setItem(`key-${key.id}`, JSON.stringify(newKey))
  return newKey
}
export const importKeyLink = (keyB64) => {
  return importKey(global.atob(keyB64))
}

export const makeKeyLink = (exportedKey) => {
  if (!exportedKey) return
  const { id, raw, salt } = exportedKey
  const minimumKey = JSON.stringify(
    Object.assign({ id }, raw ? { raw } : {}, salt ? { salt } : {})
  )
  return `${global.location.origin}/keys#${global.btoa(minimumKey)}`
}
