import { useEffect, useState } from "react"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!chrome?.bookmarks) {
      setError("Chrome bookmarks API is not available.")
      setLoading(false)
      return
    }

    chrome.bookmarks.getTree((tree) => {
      try {
        const bookmarkBar = tree?.[0]?.children?.[0]?.children || []
        setBookmarks(bookmarkBar)
      } catch (err) {
        setError("Failed to parse bookmarks.")
      } finally {
        setLoading(false)
      }
    })
  }, [])

  return { bookmarks, loading, error }
}
