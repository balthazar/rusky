const fs = require('fs')
const q = require('q')
const path = require('path')
const puppeteer = require('puppeteer')

const words = require('../src/finalWords')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (!word.link || word.type !== 'verb') {
      continue
    }

    console.log(`[${word.russian}] (${i} - ${((i / words.length) * 100).toFixed(1)}%)`)

    await page.goto(word.link)

    const { sound, conjugation } = await page.evaluate(() => {
      const sound =
        document.getElementById('wod_vocab') &&
        document.getElementById('wod_vocab').children[3] &&
        document
          .getElementById('wod_vocab')
          .children[3].innerText.match(/.*soundFile: "(.*)",.*/)[1]

      const conjugation =
        document.querySelector('.vocwords') &&
        [...document.querySelector('.vocwords').children[0].children].map(({ children }) => ({
          person: children[0].innerText,
          traduction: children[1].innerText,
        }))

      return { sound, conjugation }
    })

    if (word.type === 'verb' && conjugation) {
      console.log(conjugation)
      words[i].conjugation = conjugation
    }

    if (sound) {
      console.log(sound)
      words[i].sound = sound
    }

    words[i].done = true

    await q.nfcall(
      fs.writeFile,
      path.join(__dirname, '../src/finalWords.js'),
      `module.exports = ${JSON.stringify(words, null, 2)}`,
    )

    await sleep(200)
  }

  await browser.close()
}

main()
