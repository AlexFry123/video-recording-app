function captureUserMedia(callback, audio, video) {
  var params = { audio: true, video: true }

  navigator.mediaDevices.getUserMedia(params, callback, (error) => {
    console.log('Error capturing user media: ', error)
  })
}

export default captureUserMedia
