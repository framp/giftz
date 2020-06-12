import JsBarcode from 'jsbarcode'

export default ({ value, format, options }) => {
  const mergedOptions = {
    format: format || 'CODE128',
    renderer: 'svg',
    width: 2.7,
    height: 134,
    margin: 0,
    background: 'rgb(255,255,255,0)',
    displayValue: false,
    ...options
  }
  let renderElement
  setTimeout(() => {
    // eslint-disable-next-line
    new JsBarcode(renderElement, value, mergedOptions);
    renderElement.style.width = '100%'
    renderElement.style.height = 'auto'
  })
  return <svg ref={renderElement} />
}
