import branch from 'react-native-branch'

console.info("Subscribing to Branch links")

branch.subscribe((bundle) => {
  if (bundle.error) {
    console.error("Error from Branch: " + bundle.error)
    return
  }

  console.info("Received link response from Branch")

  console.log("params: " + bundle.params)
  if (bundle.params) {
    for (var property in bundle.params) {
      console.log(" " + property + ": " + bundle.params[property])
    }
  }

  console.log("URI: " + bundle.uri)
})
