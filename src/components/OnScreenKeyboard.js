import { createState } from 'solid-js'

export default ({ value, onInput, onSubmit }) => {
  const [state, setState] = createState({
    showLastCharacter: false
  })
  const keys = "1234567890qwertyuiopasdfghjklzxcvbnm@#$_&-+()/*\"':;!?` "
    .match(/.{1,5}/g)
    .map((row) => row.split(''))

  const onKeyClick = (key) => (e) => {
    e.preventDefault()
    onInput(value.content + key)
    setState('showLastCharacter', true)
    setTimeout(() => setState('showLastCharacter', false), 200)
  }
  const onSubmitClick = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div class='auth'>
      <h3>Insert your password:</h3>
      <div class='input'>
        <div class='chars'>
          {value.content.split('').map((char, index, chars) => (
            <span key={index}>
              {' '}
              {state.showLastCharacter && index === chars.length - 1
                ? char
                : '*'}
            </span>
          ))}
        </div>
        <button class='submit' onClick={onSubmitClick}>
          ✓
        </button>
      </div>
      <div class='keyboard'>
        {keys.map((row, index) => (
          <div class='row' key={index}>
            {row.map((key, index) => (
              <button onClick={onKeyClick(key)} key={index}>
                {key === ' ' ? '\u00A0' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
