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
import CreateKey from '../pages/CreateKey'
import Notification from './Notification'
import StoreProvider from './StoreProvider'
import './App.css'

export default () => (
  <StoreProvider>
    <ContextProvider>
      <div class='app'>
        <Notification />
        <Router fallback={<div class='no-card'>404 Page</div>}>
          <Route path='/'>{() => useHistory().push('/cards')}</Route>
          <Route path='/cards'>{() => <IndexCard />}</Route>
          <Route path='/cards/:card'>
            {() => <ReadCard cardId={useParams().card} />}
          </Route>
          <Route path='/keys'>{() => <IndexKey />}</Route>
          <Route path='/keys/new'>{() => <CreateKey />}</Route>
        </Router>
      </div>
    </ContextProvider>
  </StoreProvider>
)
