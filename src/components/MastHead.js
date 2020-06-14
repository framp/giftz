import { NavLink } from 'solid-router'

export default () => {
  return (
    <div class='masthead'>
      <div class='links'>
        <NavLink activeClass='active' href='/keys/new'>
          Generate Key
        </NavLink>
      </div>
      <div>
        <h1>Giftz</h1>
      </div>
      <div class='links'>
        <NavLink activeClass='active' href='/keys'>
          Keys
        </NavLink>
        <NavLink activeClass='active' href='/cards'>
          Cards
        </NavLink>
      </div>
    </div>
  )
}
