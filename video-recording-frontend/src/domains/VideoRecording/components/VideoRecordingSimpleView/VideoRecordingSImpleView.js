import { useState, useEffect } from 'react'
import { captureUserMedia } from '../../helpers'
import RecordRTCPromisesHandler from 'recordrtc'

const hasGetUserMedia = !!(
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
)

function VideoRecordingSimpleView() {
  const [recordVideo, setRecordVideo] = useState(null)
  const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(null)
  const [uploading, setUploading] = useState(false)

  // this.requestUserMedia = this.requestUserMedia.bind(this);
  // this.startRecord = this.startRecord.bind(this);
  // this.stopRecord = this.stopRecord.bind(this);

  useEffect(() => {
    let componentMounted = true
    setLoading(true)
    if (!hasGetUserMedia) {
      alert(
        'Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.'
      )
      setLoading(false)
      return () => {
        componentMounted = false
      }
    }
    componentMounted && requestUserMedia().then(() => setLoading(false))

    return () => {
      componentMounted = false
    }
  }, [])

  const requestUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    const recorder = new RecordRTCPromisesHandler(stream, {
      type: 'video'
    })
    setRecordVideo(recorder)
    setSrc(recorder.getDataURL(stream))
  }

  const startRecord = async () => {
    recordVideo.startRecording()

    const sleep = (m) => new Promise((r) => setTimeout(r, m))
    await sleep(3000)

    await recordVideo.stopRecording()
    let blob = await recordVideo.getBlob()
    console.log('blob', blob)
    console.log('record', recordVideo)
    // invokeSaveAsDialog(blob)
  }

  // const stopRecord = () => {
  //   recordVideo.stopRecording(() => {
  //     let params = {
  //       type: 'video/webm',
  //       data: this.state.recordVideo.blob,
  //       id: Math.floor(Math.random() * 90000) + 10000
  //     }

  //     // this.setState({ uploading: true })

  //     // S3Upload(params).then(
  //     //   (success) => {
  //     //     console.log('enter then statement')
  //     //     if (success) {
  //     //       console.log(success)
  //     //       this.setState({ uploadSuccess: true, uploading: false })
  //     //     }
  //     //   },
  //     //   (error) => {
  //     //     alert(error, 'error occurred. check your aws settings and try again.')
  //     //   }
  //     // )
  //   })
  // }

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          <div>
            <video autoPlay src={src} />
          </div>
          {uploading ? <div>Uploading...</div> : null}
          <div>
            <button onClick={startRecord}>Start Record</button>
          </div>
          {/* <div>
            <button onClick={stopRecord}>Stop Record</button>
          </div> */}
        </div>
      )}
    </>
  )
}

export default VideoRecordingSimpleView
