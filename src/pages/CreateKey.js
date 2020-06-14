import { createState, createEffect, useContext, Show } from 'solid-js'
import { encryptCards, importCards, makeCardLink } from '../logic/Card'
import { generateKey, makeKeyLink, importKey } from '../logic/Key'
import FileTextArea from '../components/FileTextArea'
import { StoreContext } from '../components/StoreProvider'
import './CreateKey.css'

export default () => {
  const { notify } = useContext(StoreContext)[1]
  const [state, setState] = createState({
    cardInput: { content: '' },
    cardOutput: '',
    cards: [],
    password: '',
    keyPassword: '',
    key: null,
    exportedKey: null
  })

  createEffect(async () => {
    let cardData = null
    try {
      cardData = state.cardInput.content && JSON.parse(state.cardInput.content)
    } catch (e) {
      console.log("Error while reading cards' data", e)
    }

    if (cardData && cardData.length) {
      const encryptedCards = await encryptCards(
        state.key,
        cardData,
        state.keyPassword
      )
      setState('cards', encryptedCards)
      const links = encryptedCards.map(makeCardLink)
      setState('cardOutput', links.join('\n'))
    }
  })

  const onGenerateKey = async (e) => {
    e.preventDefault()
    const { key, exportedKey } = await generateKey(state.password)
    setState('key', key)
    setState('exportedKey', exportedKey)
    setState('keyPassword', state.password)
  }
  const onImportKey = (e) => {
    e.preventDefault()
    const newKey = importKey(state.exportedKey)
    notify(`Added new key #${newKey.id}`)
  }
  const onImportCards = (e) => {
    e.preventDefault()
    importCards(state.cards)
    notify('Added new cards')
  }

  return (
    <form class='setup-form'>
      <section class='generate-key'>
        <h2>Generate a new key</h2>
        <input
          type='text'
          placeholder='Password'
          value={state.password}
          onInput={(e) => setState('password', e.target.value)}
        />
        <button onClick={onGenerateKey}>Generate a key</button>
        <Show when={!state.password}>
          <div class='no-pwd-notice'>
            (using an empty password is less safe)
          </div>
        </Show>
        <Show when={Boolean(state.key)}>
          <h3>Key import link generated:</h3>
          <div class='code-wrapper'>
            <code>{makeKeyLink(state.exportedKey)}</code>
          </div>
          <button onClick={onImportKey}>Import key link</button>
        </Show>
      </section>
      <Show when={Boolean(state.key)}>
        <section class='generate-cards'>
          <h2>Insert your cards data</h2>
          <FileTextArea
            value={state.cardInput}
            setValue={(value) => setState('cardInput', 'content', value)}
          />
          <Show when={Boolean(state.cardOutput)}>
            <h3>Card import links generated:</h3>
            <div class='code-wrapper'>
              <code>{state.cardOutput}</code>
            </div>
            <button onClick={onImportCards}>Import card links</button>
          </Show>
        </section>
      </Show>
    </form>
  )
}
