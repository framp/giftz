import { useContext, Show } from 'solid-js'
import { StoreContext } from './StoreProvider'

export default () => {
  const store = useContext(StoreContext)
  return (
    <Show when={Boolean(store[0].notification)}>
      <div class='notification'>{store[0].notification}</div>
    </Show>
  )
}
