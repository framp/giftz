import {
  ContextProvider,
  useParams,
  Router,
  Route,
  useHistory
} from 'solid-router'
import IndexCard from '../pages/IndexCard'
import ReadCard from '../pages/ReadCard'
import IndexKey from '../pages/IndexKey'
import ReadKey from '../pages/ReadKey'
import CreateKey from '../pages/CreateKey'
import Notification from './Notification'
import MastHead from './MastHead'
import StoreProvider from './StoreProvider'
import './App.css'

export default () => (
  <StoreProvider>
    <ContextProvider>
      <div class='app'>
        <Notification />
        <MastHead />
        <Router fallback={<div class='no-items'>404 Page</div>}>
          <Route path='/'>{() => useHistory().push('/cards')}</Route>
          <Route path='/cards'>{() => <IndexCard />}</Route>
          <Route path='/cards/:card'>
            {() => <ReadCard cardId={decodeURIComponent(useParams().card)} />}
          </Route>
          <Route path='/keys'>{() => <IndexKey />}</Route>
          <Route path='/keys/new'>{() => <CreateKey />}</Route>
          <Route path='/keys/:key'>
            {() => <ReadKey keyId={decodeURIComponent(useParams().key)} />}
          </Route>
        </Router>
      </div>
    </ContextProvider>
  </StoreProvider>
)
