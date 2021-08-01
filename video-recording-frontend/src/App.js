import { Route, Switch, BrowserRouter } from 'react-router-dom'
// import { VideoRecordingSimpleView } from './domains/VideoRecording/components'
import { ScreenRecord } from './domains/ScreenRecording/components'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ScreenRecord} />
        <Route path="/screenrecording" component={ScreenRecord} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
