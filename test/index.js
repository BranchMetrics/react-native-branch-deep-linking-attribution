import test from 'ava'

import branch from '../src/index.js'

test('subscribe returns init session', t => {
  return new Promise((resolve, reject) => {
    branch.subscribe((session) => {
      resolve()
    })
  })
})
