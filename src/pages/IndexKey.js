import { For, createEffect, createState, useContext } from 'solid-js'
import './IndexCard.css'
import { importKeyLink, loadExportedKeys } from '../logic/Key'
import { StoreContext } from '../components/StoreProvider'

export default () => {
  const { notify } = useContext(StoreContext)[1]
  const [state, setState] = createState({
    keys: []
  })
  createEffect(() => {
    const keyData = global.location.hash.slice(1)
    if (keyData.length) {
      const newKey = importKeyLink(keyData)
      notify(`Added new key #${newKey.id}`)
      global.location.hash = ''
    }
    setState('keys', loadExportedKeys())
  })

  return (
    <div>
      <ul class='card-list'>
        <For each={state.keys} fallback={<div class='no-card'>No Keys</div>}>
          {(key) => (
            <li class='key'>
              <span>Key #{key.id}</span>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
