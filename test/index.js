import test from 'ava'

import branch, { DEFAULT_INIT_SESSION_TTL } from '../src/index.js'

test.beforeEach(() => {
  branch.initSessionTtl = DEFAULT_INIT_SESSION_TTL
})

test('subscribe returns init session', t => {
  return new Promise((resolve, reject) => {
    branch.subscribe((session) => {
      resolve()
    })
  })
})

test('subscribe does not return init session beyond the TTL', t => {
  branch.initSessionTtl = 100

  return new Promise((resolve, reject) => {
    var listenerWasCalled = false
    setTimeout(() => {
      branch.subscribe(({ error, params, uri }) => {
        listenerWasCalled = true
        reject()
      })
    }, 2 * branch.initSessionTtl)

    setTimeout(() => {
      if (!listenerWasCalled) resolve()
      // else reject() was already called
    }, 3 * branch.initSessionTtl)
  })
})
