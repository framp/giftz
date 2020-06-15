export const renderDate = (date) => {
  if (isNaN(date)) return ''
  return date.toISOString()
}

export const prettyDate = (time) => {
  if (!time) return
  const date = new Date(Number(time))
  const diff = (new Date().getTime() - date.getTime()) / 1000
  const dayDiff = Math.floor(diff / 86400)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return (
      year.toString() +
      '-' +
      (month < 10 ? '0' + month.toString() : month.toString()) +
      '-' +
      (day < 10 ? '0' + day.toString() : day.toString())
    )
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60 && 'just now') ||
        (diff < 120 && '1 minute ago') ||
        (diff < 3600 && Math.floor(diff / 60) + ' minutes ago') ||
        (diff < 7200 && '1 hour ago') ||
        (diff < 86400 && Math.floor(diff / 3600) + ' hours ago'))) ||
    (dayDiff === 1 && 'yesterday') ||
    (dayDiff < 7 && dayDiff + ' days ago') ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + ' weeks ago')
  )
}
