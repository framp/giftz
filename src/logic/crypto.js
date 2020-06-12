export const generateKey = async () => {
  const raw = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    Boolean('exportable'),
    ['encrypt', 'decrypt']
  )
  return { raw }
}
export const generatePasswordKey = async (
  password,
  salt = window.crypto.getRandomValues(new Uint8Array(16))
) => {
  const importedPassword = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    !'exportable',
    ['deriveKey']
  )
  const raw = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    importedPassword,
    {
      name: 'AES-GCM',
      length: 256
    },
    !'exportable',
    ['encrypt', 'decrypt']
  )

  return { raw, salt }
}

export const exportKeyRaw = (key) => window.crypto.subtle.exportKey('jwk', key)

export const importKey = async (key, password) => {
  if (!key.raw && key.salt) {
    const { raw } = await generatePasswordKey(
      password,
      new Uint8Array(key.salt)
    )
    return { ...key, raw }
  }
  const raw = await window.crypto.subtle.importKey(
    'jwk',
    key.raw,
    {
      name: 'AES-GCM'
    },
    false,
    ['encrypt', 'decrypt']
  )
  return { ...key, raw }
}

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
      key.raw,
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
      key.raw,
      data
    )
    .then((decrypted) => new TextDecoder().decode(decrypted))
