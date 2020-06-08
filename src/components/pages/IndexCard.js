import { For, createEffect, createState, useContext } from 'solid-js'
import { useHistory } from 'solid-router'
import './IndexCard.css'
import { importLinkCard, loadCards, toggleUsedCard } from '../../logic/Card'
import { StoreContext } from '../StoreProvider'

export default () => {
  const history = useHistory()
  const { notify } = useContext(StoreContext)[1]
  const [state, setState] = createState({
    cards: []
  })
  createEffect(() => {
    const cardData = global.location.hash.slice(1)
    if (cardData.length) {
      const newCard = importLinkCard(cardData)
      notify(`Added card #${newCard.id}`)
      global.location.hash = ''
    }
    setState('cards', loadCards())
  })

  const onToggleUsedCard = (targetId) => () => {
    const card = toggleUsedCard(targetId)
    setState('cards', ({ id }) => id === targetId, card)
  }

  return (
    <div>
      <ul class='card-list'>
        <For each={state.cards} fallback={<div class='no-card'>No Cards</div>}>
          {(card) => (
            <li class={`${card.used ? 'used' : ''}`}>
              <span onClick={() => history.push(`/cards/${card.id}`)}>
                Card #{card.id} - <span>{card.amount}</span>
              </span>
              <button onClick={onToggleUsedCard(card.id)}>
                Mark {card.used ? 'unused' : 'used'}
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
