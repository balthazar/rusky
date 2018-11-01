import { matchPath } from 'react-router-dom'

import routes from '../routes'
import createStore from '../store'
import page from './page'

export default stats => async (req, res) => {
  try {
    const store = createStore()

    const promises = []

    routes.some(route => {
      const match = matchPath(req.url, route)
      if (match && route.load) {
        promises.push(route.load(store))
      }
      return match
    })

    await Promise.all(promises)

    res.end(page({ html: '', state: store.getState(), main: stats.main || 'bundle.js' }))
  } catch (err) {
    res.status(500).send(err.stack)
  }
}
