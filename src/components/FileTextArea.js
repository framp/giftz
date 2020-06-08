import { createState } from 'solid-js'

export default ({
  value,
  setValue,
  classes,
  highlightClass = 'textarea-highlight'
}) => {
  const [state, setState] = createState({ highlight: false })

  return (
    <textarea
      onDragEnter={(e) => {
        setState('highlight', true)
        e.preventDefault()
        e.stopPropagation()
      }}
      onDragOver={(e) => {
        setState('highlight', true)
        e.preventDefault()
        e.stopPropagation()
      }}
      onDragLeave={(e) => {
        setState('highlight', false)
        e.preventDefault()
        e.stopPropagation()
      }}
      onDrop={(e) => {
        setState('highlight', false)
        const reader = new global.FileReader()
        reader.readAsDataURL(e.dataTransfer.files[0])
        reader.onloadend = () => {
          const data = reader.result.split(',')[1]
          setValue(global.atob(data))
        }
        e.preventDefault()
        e.stopPropagation()
      }}
      onInput={(e) => setValue(e.target.value)}
      class={`${(classes || []).join(' ')} ${
        state.highlight ? highlightClass : ''
      }`}
      value={value.content}
    />
  )
}
