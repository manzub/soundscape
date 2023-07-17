import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './views/Home';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Login from './views/Login';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import LoadingHud from './components/LoadingHud';
import Register from './views/Register';
import { saveSpotifyAuth } from './redux/actions';
import Profile from './views/Profile';
import Toast from './components/Toast/Toast';

interface HomeState {
  user: IUser,
  app: IApp
}

function App() {
  const [toastList, setToastList] = React.useState<Array<any>>([]);
  const [inAsync, setAsyncState] = React.useState<boolean>(false);
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

  const { user, app }: HomeState = useSelector((state: ApplState) => ({user: state.user, app: state.app}), shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleAsync = (state: boolean) => {
    setAsyncState(state);
  }

  useEffect(() => {
    if (user.loggedIn) setLoggedIn(!!user.loggedIn);
  }, [user]);

  useEffect(() => {
    const hash = window.location.hash;

    if(app.spotifyAuth) {
      if(hash && !app.spotifyAuth.access_token) {
        const hash_arr = hash.substring(1).split("&");
        const credentials = hash_arr.reduce((acc, hash_item) => {
          let item = hash_item.split("=");
          return {...acc, [item[0]]: item[1]}
        }, {})
        dispatch(saveSpotifyAuth(credentials));
        navigate('/');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loggedIn) {
    return (
      <div className="wrapper">
        <Header setToastList={setToastList} />
        <div className='flex-auto overflow-auto'>
          <Navbar user={user}/>
          <div className='px-8 pt-5'>
            <Routes>
              <Route path='/' element={<Home user={user} setToastList={setToastList} />} />
              <Route path='/profile' element={<Profile handleAsync={handleAsync} setToastList={setToastList} />} />
            </Routes>
          </div>
        </div>
        <Toast position="top-right" autoDelete={true} autoDeleteTime={2000} toastList={toastList} />
      </div>
    );
  }

  return (
    <LoadingHud active={inAsync}>
      <div className='auth-page'>
        <div className='auth-header padded'></div>

        <div className='auth-body'>
          <div className='auth-center'>
            <Routes>
              <Route path='/register' element={<Register handleAsync={handleAsync} setToastList={setToastList} />} />
              <Route path='*' element={<Login handleAsync={handleAsync} />} />
            </Routes>
          </div>
        </div>
        <Toast position="top-right" autoDelete={true} autoDeleteTime={2000} toastList={toastList} />
      </div>
    </LoadingHud>
  )
}

export default App;
