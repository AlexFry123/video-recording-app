import { useState } from 'react'
import RecordRTC from 'recordrtc'
import ScreenRecordPreviewModal from './ScreenRecordPreviewModal'
import { Button, Row, Col, Container, Card, CardBody } from 'reactstrap'
// import Topbar from './Topbar'

function ScreenRecord() {
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null)
  const [isOpenVideoModal, setIsOpenVideoModal] = useState(false)
  const [screen, setScreen] = useState(null)
  const [camera, setCamera] = useState(null)
  const [recorder, setRecorder] = useState(null)
  const [startDisable, setStartDisable] = useState(false)
  const [stopDisable, setStopDisable] = useState(true)
  const [loadModal, setLoadModal] = useState(false)
  const [recordPreview, setRecordPreview] = useState(null)

  //  to enable audio and video pass true to disable pass false
  const captureCamera = (cb) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true //make it true for video
      })
      .then(cb)
  }
  //  access your screen width and height  using window object adjusting camera position ,height and width
  //  after that pass screen and camera to recordrtc/and call startrecording method using recorder object to
  //  start screen recording
  const startScreenRecord = async () => {
    setStopDisable(false)
    setStartDisable(true)
    captureScreen((screen) => {
      captureCamera(async (camera) => {
        screen.width = window.screen.width
        screen.height = window.screen.height
        screen.fullcanvas = true
        camera.width = 320
        camera.height = 240
        camera.top = screen.height - camera.height
        camera.left = screen.width - camera.width
        setScreen(screen)
        setCamera(camera)
        const tempRecorder = RecordRTC([screen, camera], {
          type: 'video'
        })
        tempRecorder.startRecording()
        tempRecorder.screen = screen
        setRecorder(tempRecorder)
      })
    })
  }

  //destroy screen recording
  const stopRecordingCallback = async () => {
    await stopLocalVideo(screen, camera)
    let recordedVideoUrl
    if (recorder.getBlob()) {
      setRecordPreview(recorder.getBlob())
      recordedVideoUrl = URL.createObjectURL(recorder.getBlob())
    }
    setRecordedVideoUrl(recordedVideoUrl)
    setScreen(null)
    setIsOpenVideoModal(true)
    setStartDisable(false)
    setStopDisable(true)
    setCamera(null)
    recorder.screen.stop()
    recorder.destroy()
    setRecorder(null)
  }

  //  to capture screen  we need to make sure that which media devices are captured and add listeners to
  //  start and stop stream
  const captureScreen = (callback) => {
    invokeGetDisplayMedia(
      (screen) => {
        addStreamStopListener(screen, () => {})
        callback(screen)
      },
      (error) => {
        console.error(error)
        alert(
          'Unable to capture your screen. Please check console logs.\n' + error
        )
        setStopDisable(true)
        setStartDisable(false)
      }
    )
  }
  //tracks stop
  const stopLocalVideo = async (screen, camera) => {
    ;[screen, camera].forEach(async (stream) => {
      stream.getTracks().forEach(async (track) => {
        track.stop()
      })
    })
  }
  //getting media items
  const invokeGetDisplayMedia = (success, error) => {
    // var displaymediastreamconstraints = {
    //   video: {
    //     displaySurface: 'monitor', // monitor, window, application, browser
    //     logicalSurface: true,
    //     cursor: 'always' // never, always, motion
    //   }
    // };
    // above constraints are NOT supported YET
    // that's why overriding them
    const displaymediastreamconstraints = {
      video: true,
      audio: true
    }
    if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia(displaymediastreamconstraints)
        .then(success)
        .catch(error)
    } else {
      navigator
        .getDisplayMedia(displaymediastreamconstraints)
        .then(success)
        .catch(error)
    }
  }

  // stop screen recording
  const stop = async () => {
    setStartDisable(true)
    recorder.stopRecording(stopRecordingCallback)
  }

  //adding event listener
  const addStreamStopListener = (stream, callback) => {
    stream.addEventListener(
      'ended',
      () => {
        callback()
        callback = () => {}
      },
      false
    )
    stream.addEventListener(
      'inactive',
      () => {
        callback()
        callback = () => {}
      },
      false
    )
    stream.getTracks().forEach((track) => {
      track.addEventListener(
        'ended',
        () => {
          callback()
          callback = () => {}
        },
        false
      )
      track.addEventListener(
        'inactive',
        () => {
          callback()
          callback = () => {}
        },
        false
      )
    })
    stream.getVideoTracks()[0].onended = () => {
      stop()
    }
  }

  //close video modal
  const videoModalClose = () => {
    setIsOpenVideoModal(false)
  }
  //open load alert
  const openModal = () => {
    setLoadModal(false)
  }
  return (
    <div>
      {/* <Topbar sr={true} /> */}
      <Container className="pt-3">
        <div className="centerCard">
          <div className="shadow">
            <Card>
              <CardBody>
                <Row>
                  <Col sm={12}>
                    <h3 className="text-dark pb-2 textShadowHead text-center">
                      Screen Recording
                    </h3>
                    <h5 className="text-primary my-2">
                      Follow the below steps to do screen recording
                    </h5>
                    <p className="mt-0 mb-1 textShadowPara">
                      * To start recording click on start recording
                    </p>
                    <p className="mt-0 mb-1 textShadowPara pr-1">
                      * Select the screen type to start recording
                    </p>
                    <p className="mt-0 mb-1 textShadowPara pl-1">
                      * Click on share button to confirm recording
                    </p>
                    <p className="pb-3 mt-0 mb-1 textShadowPara">
                      * To stop recording click on stop recording
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="text-center">
                    <Button
                      color="primary"
                      outline
                      onClick={startScreenRecord}
                      disabled={startDisable}>
                      Start Recording
                    </Button>
                    <Button
                      color="primary"
                      onClick={stop}
                      disabled={stopDisable}>
                      Stop Recording
                    </Button>
                    {startDisable && (
                      <h3 className="text-success pt-2">Recording..</h3>
                    )}
                    {startDisable && (
                      <h3 className="text-warning pt-2">
                        Please don't refresh page.
                      </h3>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </div>
        <ScreenRecordPreviewModal
          isOpenVideoModal={isOpenVideoModal}
          videoModalClose={videoModalClose}
          recordedVideoUrl={recordedVideoUrl}
          recorder={recordPreview}
        />
      </Container>
    </div>
  )
}

export default ScreenRecord
