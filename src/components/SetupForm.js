import { createState, createEffect } from 'solid-js'
import makeOperations, { operationSeparator } from '../logic/operations'
import './SetupForm.css'

export default ({ key, exportedKey, onSetup }) => {
  const [state, setState] = createState({
    cardInput: '',
    cardOutput: '',
    cards: []
  })
  const { encryptCards } = makeOperations(state, setState)

  createEffect(async () => {
    let cardData = null
    try {
      cardData = state.cardInput && JSON.parse(state.cardInput)
    } catch (e) {
      console.log("Error while reading cards' data", e)
    }

    if (cardData && cardData.length) {
      const encryptedData = await encryptCards(key, cardData)
      setState('cards', encryptedData)
      const links = encryptedData.map(({ barcode, number, pin, amount, id }) =>
        ['#addCard', barcode, number, pin, amount, id].join(operationSeparator)
      )
      setState('cardOutput', links.join('\n'))
    }
  })

  return (
    <form class='setup-form'>
      <h2>Insert your cards</h2>
      <textarea onKeyUp={(e) => setState('cardInput', e.target.value)}>
        {state.cardInput}
      </textarea>
      <h2>Grab your links here</h2>
      <textarea onKeyUp={(e) => setState('cardOutput', e.target.value)}>
        {state.cardOutput}
      </textarea>
      <h2>Key Link</h2>
      <input
        value={['#importKey', global.btoa(exportedKey)].join(
          operationSeparator
        )}
      />
      <button onClick={() => onSetup(state.cards)}>I'm done</button>
    </form>
  )
}
