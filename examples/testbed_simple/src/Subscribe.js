import { BranchSubscriber } from 'react-native-branch'

console.info("Subscribing to Branch links")

const subscriber = new BranchSubscriber({
  onOpenStart: ({ uri }) => {
    console.info('Branch opening ' + uri)
  },
  onOpenComplete: ({ error, params, uri }) => {
    if (error) {
      console.error("Error from Branch opening URI '" + uri + "': " + error)
      return
    }

    console.info("Received link response from Branch for " + uri)

    console.log("params: " + JSON.stringify(params))
  },
})

subscriber.subscribe()
