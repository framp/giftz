import { For, createEffect, createState, useContext } from 'solid-js'
import './IndexItem.css'
import { useHistory } from 'solid-router'
import { importKeyLink, loadExportedKeys } from '../logic/Key'
import { StoreContext } from '../components/StoreProvider'

export default () => {
  const history = useHistory()
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
      <ul class='item-list'>
        <For each={state.keys} fallback={<div class='no-items'>No Keys</div>}>
          {(key) => (
            <li
              onClick={() =>
                history.push(`/keys/${global.encodeURIComponent(key.id)}`)}
            >
              <span>Key #{key.id}</span>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
