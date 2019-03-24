export function search(word) {
  // req, then
  return {
    type: 'SEARCH',
    word: word,
    results: []
  }
}
