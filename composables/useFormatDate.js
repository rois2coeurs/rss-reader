export function useFormatDate() {
  const formatDate = (date) => {
    const now = new Date()
    const diff = now - date

    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      if (hours < 1) {
        const minutes = Math.floor(diff / 60000)
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
      }
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    }

    return date.toLocaleDateString()
  }

  return { formatDate }
}