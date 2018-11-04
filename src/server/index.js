import q from 'q'
import fs from 'fs'
import path from 'path'
import express from 'express'
import compression from 'compression'

import render from './render'
import * as globals from '../globals'

Object.keys(globals).forEach(key => (global[key] = globals[key]))

const ASSETS_FOLDER = path.resolve(__dirname, '../assets')
const DIST_FOLDER = path.resolve(__dirname, '../../dist')
const STATS_FILE = path.resolve(DIST_FOLDER, 'stats.json')

const server = express()
const port = process.env.PORT || 3000
const stats = __PROD__ ? require(STATS_FILE) : {}

if (__DEV__) {
  require('./webpack').default(server)
}

if (__PROD__) {
  server.use(compression())
  server.use('/dist', express.static(DIST_FOLDER))
}

server.get('/known', async (req, res) => {
  const out = await q.nfcall(fs.readFile, path.join(__dirname, '../knownWords.js'))
  res.send(JSON.parse(out.toString().replace('module.exports = ', '')))
})

server.get('/known/:id', async (req, res) => {
  const out = require('../knownWords')
  out[req.params.id] = !out[req.params.id]

  await q.nfcall(
    fs.writeFile,
    path.join(__dirname, '../knownWords.js'),
    `module.exports = ${JSON.stringify(out, null, 2)}`,
  )

  res.status(200).end()
})

server.use('/assets', express.static(ASSETS_FOLDER))
server.use(render(stats))

server.listen(port, 'localhost', () => {
  console.log(`[server] http://localhost:${port} - ${__ENV__}`) // eslint-disable-line no-console
})
