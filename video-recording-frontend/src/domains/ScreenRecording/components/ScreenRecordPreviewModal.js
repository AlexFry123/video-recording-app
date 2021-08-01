import { useState } from 'react'
import { Modal, ModalBody, ModalHeader, Button, Row } from 'reactstrap'
import RecordRTC from 'recordrtc'

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

function ScreenRecordPreviewModal(props) {
  const { recorder, isOpenVideoModal, videoModalClose, recordedVideoUrl } =
    props

  const [isLoaded, setIsLoaded] = useState(false)
  // Download option for screen record
  const downloadScreenRecordVideo = () => {
    const recorderBlob = recorder
    if (!recorderBlob) {
      return
    }
    if (isSafari) {
      if (recorderBlob && recorderBlob.getDataURL) {
        recorderBlob.getDataURL(function (dataURL) {
          RecordRTC.SaveToDisk(dataURL, getFileName('mp4'))
        })
        return
      }
    }
    if (recorderBlob) {
      const blob = recorderBlob
      const file = new File([blob], getFileName('mp4'), {
        type: 'video/mp4'
      })
      RecordRTC.invokeSaveAsDialog(file)
    }
  }
  // Get file name
  const getFileName = (fileExtension) => {
    const d = new Date()
    const year = d.getFullYear()
    const month = d.getMonth()
    const date = d.getDate()
    return (
      'ScreenRecord-' +
      year +
      month +
      date +
      '-' +
      getRandomString() +
      '.' +
      fileExtension
    )
  }
  // Get random string for file name
  const getRandomString = () => {
    if (
      window.crypto &&
      window.crypto.getRandomValues &&
      navigator.userAgent.indexOf('Safari') === -1
    ) {
      const a = window.crypto.getRandomValues(new Uint32Array(3))
      let token = ''
      for (let i = 0, l = a.length; i < l; i++) {
        token += a[i].toString(36)
      }
      return token
    } else {
      return (Math.random() * new Date().getTime())
        .toString(36)
        .replace(/\./g, '')
    }
  }

  return (
    <Modal isOpen={isOpenVideoModal}>
      <ModalHeader className="video__modal__header" toggle={videoModalClose}>
        <button
          className="lnr lnr-cross video__modal__clsBtn formModalCloseButton"
          type="button"
          onClick={videoModalClose}
        />
        <span className="bold-text">Preview Screen Record</span>
      </ModalHeader>
      <ModalBody>
        <Row className="downloadButtonAlign">
          <Button color="primary" outline onClick={downloadScreenRecordVideo}>
            Download
          </Button>
        </Row>
        <video
          id="videorecord"
          controls
          // controlsList="nodownload"
          autoPlay={isLoaded}
          playsInline
          width={'100%'}
          height={'100%'}
          src={recordedVideoUrl}
        />
      </ModalBody>
    </Modal>
  )
}

export default ScreenRecordPreviewModal
