class DataCollector {
  async getWeatherData (url) {
    const response = await fetch(url)
    const responseData = await response.json()
    return responseData
  }

  // Promise with fetch
  getFetchPromise (url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  }

  // Collect two Fetch Promises and wait until both will be resolved
  waitUntilGotData (firstPromise, secondPromise) {
    return Promise.all([firstPromise, secondPromise])
      .then(function (values) {
        return values
      })
  }
}
