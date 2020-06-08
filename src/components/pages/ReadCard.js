import { createEffect, createState, useContext, Show } from 'solid-js'
import { useHistory } from 'solid-router'
import './ReadCard.css'
import { StoreContext } from '../StoreProvider'
import { loadCard, decryptCard, toggleUsedCard } from '../../logic/Card'
import { loadKey } from '../../logic/Key'

export default ({ cardId }) => {
  const [store, { notify, rememberPassword }] = useContext(StoreContext)
  const history = useHistory()
  const [state, setState] = createState({
    card: {},
    password: '',
    requirePassword: false,
    submittedPassword: false
  })
  createEffect(async () => {
    const loadedCard = loadCard(cardId)
    const savedPassword =
      store.passwords[loadedCard.keyId] &&
      store.passwords[loadedCard.keyId].password
    try {
      const key = await loadKey(
        loadedCard.keyId,
        (state.submittedPassword && state.password) || savedPassword
      )
      const decryptedCard = await decryptCard(key, loadedCard)
      if (state.submittedPassword && state.password) {
        rememberPassword(state.password, loadedCard.keyId)
      }
      setState('card', decryptedCard)
    } catch (e) {
      setState({
        password: '',
        submittedPassword: false
      })
      if (e.message === 'password-required') {
        setState('requirePassword', true)
      } else {
        notify('Wrong password')
      }
    }
  })

  const onToggleUsedCard = (targetId) => () => {
    const toggledCard = toggleUsedCard(targetId)
    setState('card', 'used', toggledCard.used)
  }
  const onSubmitPasswod = (e) => {
    e.preventDefault()
    setState('submittedPassword', true)
  }
  const card = state.card

  return (
    <div class={`${card.used ? 'used' : ''} card`}>
      <div class='buttons'>
        <button onClick={() => history.push('/cards')}>Back to List</button>
        <button onClick={onToggleUsedCard(cardId)}>
          Mark as {card.used ? 'unused' : 'used'}
        </button>
      </div>
      <Show when={state.requirePassword && !state.submittedPassword}>
        <div class='auth'>
          Insert your password:
          <input
            type='password'
            value={state.password}
            onInput={(e) => setState('password', e.target.value)}
          />
          <button onClick={onSubmitPasswod}>Submit</button>
        </div>
      </Show>
      <Show when={state.card.id}>
        <div class='data'>
          <h2>
            Card #{card.id} - {card.amount}
          </h2>
          <img src={`data:image/png;base64, ${card.barcode}`} alt='barcode' />
          <span class='card-number'>
            {card.number &&
              [
                card.number.slice(0, 4),
                card.number.slice(4, 8),
                card.number.slice(8, 12),
                card.number.slice(12, 16),
                card.number.slice(16)
              ].join(' ')}
          </span>
          <span class='card-pin'>
            <strong>PIN:</strong> {card.pin}
          </span>
        </div>
      </Show>
    </div>
  )
}
