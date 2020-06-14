import { For, createEffect, createState, useContext } from 'solid-js'
import { useHistory } from 'solid-router'
import './IndexItem.css'
import { importLinkCard, loadCards, updateCard } from '../logic/Card'
import { StoreContext } from '../components/StoreProvider'

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
    const card = updateCard(targetId, (card) => ({
      ...card,
      used: !card.used
    }))
    setState('cards', ({ id }) => id === targetId, card)
  }

  return (
    <div>
      <ul class='item-list'>
        <For each={state.cards} fallback={<div class='no-items'>No Cards</div>}>
          {(card) => (
            <li class={`${card.used ? 'used' : ''}`}>
              <span
                onClick={() =>
                  history.push(`/cards/${global.encodeURIComponent(card.id)}`)}
              >
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
