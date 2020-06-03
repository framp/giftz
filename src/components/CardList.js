import { For } from 'solid-js'

import './CardList.css'

export default ({ cards, onOpenCard, onToggleUsedCard }) => (
  <div>
    <ul class='card-list'>
      <For each={cards} fallback={<div class='no-card'>No Cards</div>}>
        {(card) => (
          <li class={`${card.used ? 'used' : ''}`}>
            <span onClick={() => onOpenCard(card.id)}>
              Card #{card.id} - <span>{card.amount}</span>
            </span>
            <button onClick={() => onToggleUsedCard(card.id)}>
              Mark {card.used ? 'unused' : 'used'}
            </button>
          </li>
        )}
      </For>
    </ul>
  </div>
)
