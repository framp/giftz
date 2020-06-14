import { createEffect, createState, useContext, Show, For } from 'solid-js'
import { useHistory } from 'solid-router'
import './ReadItem.css'
import { StoreContext } from '../components/StoreProvider'
import { loadCards } from '../logic/Card'
import prettyDate from '../logic/prettyDate'
import { loadKey, deleteKey, makeKeyLink } from '../logic/Key'

export default ({ keyId }) => {
  const [, { notify }] = useContext(StoreContext)

  const history = useHistory()
  const [state, setState] = createState({
    key: {},
    cards: [],
    displayConfirmDelete: false
  })
  createEffect(async () => {
    const key = loadKey(keyId, null, false)
    setState('key', key)
    const cards = loadCards({ filter: ({ keyId }) => keyId === key.id })
    setState('cards', cards)
  })

  const onDeleteKey = (e) => {
    e.preventDefault()
    setState('displayConfirmDelete', true)
  }
  const onCancelDeleteClick = (e) => {
    e.preventDefault()
    setState('displayConfirmDelete', false)
  }
  const onConfirmDeleteClick = (e) => {
    e.preventDefault()
    deleteKey(keyId)
    notify('Key deleted')
    history.push('/keys')
  }
  return (
    <div class='item'>
      <div class='buttons'>
        <button onClick={() => history.push('/keys')}>Back to List</button>
        <button onClick={onDeleteKey}>Delete</button>
      </div>
      <Show when={state.displayConfirmDelete}>
        <div class='confirm-delete'>
          <span>Are you sure you want to delete this key?</span>{' '}
          <span> All the attached cards will stop working</span>
          <div class='buttons'>
            <button onClick={onCancelDeleteClick}>Cancel</button>
            <button onClick={onConfirmDeleteClick}>Delete</button>
          </div>
        </div>
      </Show>
      <Show when={!state.displayConfirmDelete && state.key.id}>
        <div class='data'>
          <h2>
            Key #
            {state.key.id &&
              [
                state.key.id.slice(0, 8),
                state.key.id.slice(8, 12),
                state.key.id.slice(12, 16),
                state.key.id.slice(12, 16),
                state.key.id.slice(16)
              ].join('-')}
          </h2>
          <a class='date' data-date={state.key.createdAt}>
            <Show when={state.key.createdAt}>
              Added {prettyDate(state.key.createdAt)}
            </Show>
          </a>
          <p>
            Require Password:
            <span class='value'>{state.key.raw ? ' NO' : ' YES'}</span>
          </p>

          <div class='code-wrapper'>
            <code>{makeKeyLink(state.key)}</code>
          </div>

          <ul>
            <For
              each={state.cards}
              fallback={<div class='no-items'>No Cards</div>}
            >
              {(card) => (
                <li
                  onClick={() =>
                    history.push(`/cards/${global.encodeURIComponent(card.id)}`)}
                >
                  Card #{card.id} - <span>{card.amount}</span>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  )
}
