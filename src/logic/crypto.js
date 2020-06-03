export const generateKey = () =>
  window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    Boolean('extractable'),
    ['encrypt', 'decrypt']
  )

export const exportKey = (key) => window.crypto.subtle.exportKey('jwk', key)

export const importKey = (key) =>
  window.crypto.subtle.importKey(
    'jwk',
    key,
    {
      name: 'AES-GCM'
    },
    false,
    ['encrypt', 'decrypt']
  )

export const encrypt = (
  key,
  data,
  iv = window.crypto.getRandomValues(new Uint8Array(16))
) =>
  window.crypto.subtle
    .encrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128
      },
      key,
      new TextEncoder().encode(data)
    )
    .then((encrypted) => [iv, new Uint8Array(encrypted)])

export const decrypt = (key, [iv, data]) =>
  window.crypto.subtle
    .decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128
      },
      key,
      data
    )
    .then((decrypted) => new TextDecoder().decode(decrypted))

export const encryptEncode = async (key, data) =>
  global.btoa(
    JSON.stringify(
      await encrypt(key, String(data)).catch((e) =>
        console.log('Encrypt error', e)
      )
    )
  )

export const decryptDecode = (key, data) =>
  decrypt(
    key,
    JSON.parse(global.atob(data)).map(
      (values) => new Uint8Array(Object.values(values))
    )
  ).catch((e) => console.log('Decrypt error', e))
