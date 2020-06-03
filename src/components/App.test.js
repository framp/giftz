import { render, it } from 'solid-js/dom'
import App from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const dispose = render(App, div)
  div.textContent = ''
  dispose()
})
