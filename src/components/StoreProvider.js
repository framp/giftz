import { createState, createContext } from 'solid-js'

export const StoreContext = createContext([{ notification: '' }, {}])

export default (props) => {
  const [state, setState] = createState({
    notification: props.notification || '',
    passwords: {}
  })
  const store = [
    state,
    {
      notify (message) {
        setState('notification', message)
        setTimeout(() => setState('notification', ''), 2000)
      },
      rememberPassword (password, keyId, timeout = 10 * 60 * 1000) {
        if (state.passwords[keyId] && state.passwords[keyId].passwordTimeout) {
          clearTimeout(state.passwords[keyId].passwordTimeout)
        }
        const passwordTimeout = setTimeout(() => {
          setState('passwords', keyId, {})
        }, timeout)
        setState('passwords', keyId, {
          password,
          passwordTimeout
        })
      }
    }
  ]

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  )
}
