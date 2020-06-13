import { Link } from 'solid-router'

export default () => {
  return (
    <div class='masthead'>
      <div class='links'>
        <Link href='/keys/new'>Generate Key</Link>
      </div>
      <div>
        <h1>Giftz</h1>
      </div>
      <div class='links'>
        <Link href='/keys'>Keys</Link>
        <Link href='/cards'>Cards</Link>
      </div>
    </div>
  )
}
