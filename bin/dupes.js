const fs = require('fs')
const q = require('q')
const path = require('path')
const { generate } = require('shortid')

const words = require('../src/finalWords')

const main = async () => {
  console.log(words.length)

  for (let i = 0; i < words.length; i++) {
    words[i].id = generate()
  }

  const toRemove = []

  const unique = words.reduce((acc, cur) => {
    if (acc[cur.russian] && acc[cur.russian].type === 'word' && cur.type === 'noun') {
      toRemove.push(acc[cur.russian].id)
      return acc
    }

    acc[cur.russian] = cur

    return acc
  }, {})

  const final = words.reduce((acc, cur) => {
    if (toRemove.includes(cur.id)) {
      return acc
    }

    delete cur.id

    acc.push(cur)
    return acc
  }, [])

  console.log(final.length)

  await q.nfcall(
    fs.writeFile,
    path.join(__dirname, '../src/finalWords.js'),
    `module.exports = ${JSON.stringify(final, null, 2)}`,
  )
}

main()
