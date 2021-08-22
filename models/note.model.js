var data = [
  { title: "Title 1", content: "Content 1"}
]


exports.getNotes = () => {
  return data
}

exports.addNotes = (note) => {
  data.push(note)
}

exports.removeNotes = (title) => {
  const idx = data.findIndex(x => x.title == title)
  data.splice(idx, 1)
}
