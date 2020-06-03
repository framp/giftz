import './Card.css'

export default ({ onBackToList, onToggleUsedCard, card }) => (
  <div class={`${card.used ? 'used' : ''} card`}>
    <div class='buttons'>
      <button onClick={onBackToList}>Back to List</button>
      <button onClick={() => onToggleUsedCard(card.id)}>
        Mark as {card.used ? 'unused' : 'used'}
      </button>
    </div>
    <div class='data'>
      <h2>
        Card #{card.id} - {card.amount}
      </h2>
      <img src={`data:image/png;base64, ${card.barcode}`} alt='barcode' />
      <span class='card-number'>
        {[
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
  </div>
)
