function safePart(value) {
  const withoutControls = Array.from(value, (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127 ? ' ' : character).join('')
  const cleaned = withoutControls.replace(/[<>:"/\\|?*]/g, ' ').replace(/\s+/g, ' ').replace(/^[.\s]+|[.\s]+$/g, '')
  let result = ''
  let bytes = 0
  for (const character of cleaned) {
    const size = new TextEncoder().encode(character).length
    if (bytes + size > 80) break
    result += character
    bytes += size
  }
  return result.replace(/[.\s]+$/g, '') || 'viagem'
}

export function reportFilename(title, destination) {
  return `${safePart(title)} ${safePart(destination)} relatório.pdf`
}
