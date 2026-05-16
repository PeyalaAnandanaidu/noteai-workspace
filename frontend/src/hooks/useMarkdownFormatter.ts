import { useCallback, useRef } from 'react'

interface TextareaRef {
  current: HTMLTextAreaElement | null
}

export function useMarkdownFormatter(textareaRef: TextareaRef) {
  const lastActionRef = useRef<{ before: string; after: string } | null>(null)

  // Get selected text or word at cursor
  const getSelectedText = useCallback((): string | null => {
    const textarea = textareaRef.current
    if (!textarea) return null

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    // If text is selected, return it
    if (start !== end) {
      return textarea.value.substring(start, end)
    }

    // Otherwise, select the current word
    const text = textarea.value
    let wordStart = start
    let wordEnd = end

    // Move backwards to find word start
    while (wordStart > 0 && /\w/.test(text[wordStart - 1])) {
      wordStart--
    }

    // Move forwards to find word end
    while (wordEnd < text.length && /\w/.test(text[wordEnd])) {
      wordEnd++
    }

    // If no word found, use placeholder
    if (wordStart === wordEnd) {
      return 'text'
    }

    return text.substring(wordStart, wordEnd)
  }, [textareaRef])

  // Apply formatting with selection replacement
  const formatText = useCallback(
    (before: string, after: string, onChange?: (newContent: string) => void) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const selectedText =
        start !== end ? text.substring(start, end) : getSelectedText() || 'text'

      // Create new text with formatting
      const newContent =
        text.substring(0, start) +
        before +
        selectedText +
        after +
        text.substring(end)

      // Update the content (parent will handle state)
      if (onChange) {
        onChange(newContent)
      }

      // Restore cursor position after formatting
      setTimeout(() => {
        const newCursorPos = start + before.length + selectedText.length
        textarea.selectionStart = newCursorPos
        textarea.selectionEnd = newCursorPos
        textarea.focus()
      }, 0)

      lastActionRef.current = { before, after }
    },
    [getSelectedText, textareaRef]
  )

  // Insert text at cursor or replace selection
  const insertLine = useCallback(
    (prefix: string, onChange?: (newContent: string) => void) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value

      // Find the start of the current line
      let lineStart = start
      while (lineStart > 0 && text[lineStart - 1] !== '\n') {
        lineStart--
      }

      // Get the content from line start to cursor
      const beforeCursor = text.substring(lineStart, start)

      // Check if prefix already exists
      if (beforeCursor.startsWith(prefix)) {
        // Remove prefix
        const newContent =
          text.substring(0, lineStart) +
          beforeCursor.substring(prefix.length) +
          text.substring(end)

        if (onChange) {
          onChange(newContent)
        }

        setTimeout(() => {
          textarea.selectionStart = start - prefix.length
          textarea.selectionEnd = start - prefix.length
          textarea.focus()
        }, 0)
      } else {
        // Add prefix
        const newContent =
          text.substring(0, lineStart) +
          prefix +
          beforeCursor +
          text.substring(start)

        if (onChange) {
          onChange(newContent)
        }

        setTimeout(() => {
          textarea.selectionStart = start + prefix.length
          textarea.selectionEnd = start + prefix.length
          textarea.focus()
        }, 0)
      }
    },
    [textareaRef]
  )

  // Handle special formatting (heading, quote, list)
  const formatLine = useCallback(
    (prefix: string, onChange?: (newContent: string) => void) => {
      insertLine(prefix, onChange)
    },
    [insertLine]
  )

  return { formatText, formatLine, getSelectedText }
}