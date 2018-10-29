const fs = require('fs')
const q = require('q')
const path = require('path')

const words = require('../src/words')

const main = async () => {
  console.log(words.length)

  const unique = words.reduce((acc, cur) => {
    if (!acc[cur.russian]) {
      acc[cur.russian] = cur
      return acc
    }

    if (cur.link && !acc[cur.link]) {
      acc[cur.link] = cur
      return acc
    }

    if (
      acc[cur.russian] &&
      !acc[cur.russian].sound &&
      !acc[cur.russian].link &&
      cur.type === 'verb'
    ) {
      acc[cur.russian] = cur
      return acc
    }

    if (
      acc[cur.russian] &&
      acc[cur.russian].sound &&
      acc[cur.russian].link &&
      cur.type === 'verb'
    ) {
      acc[cur.russian].type = 'verb'
      acc[cur.russian].rank = cur.rank
      acc[cur.russian].pair = cur.pair
      return acc
    }

    if (
      acc[cur.russian] &&
      acc[cur.russian].sound &&
      acc[cur.russian].link &&
      cur.type === 'noun'
    ) {
      acc[cur.russian].type = 'noun'
      acc[cur.russian].rank = cur.rank
      acc[cur.russian].pair = cur.pair
      acc[cur.russian].gender = cur.gender
      return acc
    }

    if (
      acc[cur.russian] &&
      !acc[cur.russian].sound &&
      !acc[cur.russian].link &&
      !cur.sound &&
      !cur.link &&
      cur.gender &&
      cur.type === 'noun'
    ) {
      acc[cur.russian].type = 'noun'
      acc[cur.russian].rank = cur.rank
      acc[cur.russian].pair = cur.pair
      acc[cur.russian].gender = cur.gender
      return acc
    }

    console.log(acc[cur.russian], cur.link && acc[cur.link])
    console.log('-----')

    console.log(cur)
    process.exit(0)

    return acc
  }, {})

  const res = Object.keys(unique).map(k => unique[k])

  await q.nfcall(
    fs.writeFile,
    path.join(__dirname, '../src/finalWords.js'),
    `module.exports = ${JSON.stringify(res, null, 2)}`,
  )
}

main()
