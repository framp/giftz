import {
  createState,
  createDependentEffect,
  Show,
  Switch,
  Match
} from 'solid-js'
import makeOperations, { operationSeparator } from '../logic/operations'
import CardList from './CardList'
import Card from './Card'
import SetupForm from './SetupForm'
import './App.css'

export default () => {
  const [state, setState] = createState({
    key: '',
    exportedKey: '',
    mode: 'default',
    cards: [],
    openCard: null,
    notification: null
  })
  const operations = makeOperations(state, setState)
  createDependentEffect(async () => {
    const { hash } = global.location
    if (hash) {
      const [op, ...params] = hash.slice(1).split(operationSeparator)
      const result = await operations[op](...params)
      if (result) {
        console.log(result)
      }
    } else {
      operations.loadCards()
      operations.loadKey()
    }
  }, [])

  const onBackToList = () => {
    setState('mode', 'default')
    setState('openCard', null)
  }

  const onOpenCard = async (targetId) => {
    const card = state.cards.find(({ id }) => id === targetId)
    const decryptedCard = await operations.decryptCard(state.key, card)
    setState('openCard', decryptedCard)
    setState('mode', 'view-card')
  }

  const onToggleUsedCard = operations.toggleUsedCard

  return (
    <div class='app'>
      <Show when={state.notification}>
        <div class='notification'>{state.notification}</div>
      </Show>
      <Switch>
        <Match when={state.mode === 'setup'}>
          <SetupForm
            key={state.key}
            exportedKey={state.exportedKey}
            onSetup={operations.handleSetupCards}
          />
        </Match>
        <Match when={state.mode === 'default'}>
          <CardList cards={state.cards} {...{ onOpenCard, onToggleUsedCard }} />
        </Match>
        <Match when={state.mode === 'view-card'}>
          <Card card={state.openCard} {...{ onBackToList, onToggleUsedCard }} />
        </Match>
      </Switch>
    </div>
  )
}
