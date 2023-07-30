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
import Playlist from './views/Playlist';
import spotifyLogin from './spotify/login';
import SearchPage from './views/Search';
import Collection from './views/Collection';

interface HomeState {
  user: IUser,
  app: IApp
}

function App() {
  const [toastList, setToastList] = React.useState<Array<any>>([]);
  const [inAsync, setAsyncState] = React.useState<boolean>(false);
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [searching, setSearching] = React.useState<boolean>(false);

  const { user, app }: HomeState = useSelector((state: ApplState) => ({ user: state.user, app: state.app }), shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleAsync = (state: boolean) => {
    setAsyncState(state);
  }

  useEffect(() => {
    if (searchQuery !== '') {
      setSearching(true);
    } else {
      setSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (user.loggedIn) setLoggedIn(!!user.loggedIn);
  }, [user]);

  useEffect(() => {
    const hash = window.location.hash;

    if (app.spotifyAuth) {
      if (hash && !app.spotifyAuth.access_token) {
        const hash_arr = hash.substring(1).split("&");
        const credentials = hash_arr.reduce((acc, hash_item) => {
          let item = hash_item.split("=");
          return { ...acc, [item[0]]: item[1] }
        }, {})
        dispatch(saveSpotifyAuth(credentials));
        navigate('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loggedIn) {

    if (!app.spotifyAuth.access_token) {
      return (
        <LoadingHud active={inAsync}>
          <div className=''>
            <div className="login">
              <img src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
                alt="" />
              <div className='lgn_btn flex flex-col gap-4'>
                <button onClick={spotifyLogin.loginWithSpotify} disabled={!!app.spotifyAuth.access_token} className='spotify_lgn'>CONNECT SPOTIFY</button>
                <button className='ios_lgn'>CONNECT AppleMusic</button>
              </div>
            </div>
          </div>
        </LoadingHud>
      )
    }

    return (
      <LoadingHud active={inAsync}>
        <div className="wrapper">
          <Header setToastList={setToastList} />
          <div className='flex-auto overflow-auto'>
            <Navbar query={searchQuery} setSearchQuery={setSearchQuery} />
            <div className='px-8 pt-5'>
              <Routes>
                <Route path='/' element={<Home user={user} setToastList={setToastList} />} />
                <Route path='/search' element={<SearchPage setToastList={setToastList} query={searchQuery} searching={searching} setQuery={setSearchQuery} />} />
                <Route path='/collection' element={<Collection setToastList={setToastList} />} />
                <Route path='/playlist/:source/:id' element={<Playlist setToastList={setToastList} handleAsync={handleAsync} />} />
                <Route path='/profile' element={<Profile handleAsync={handleAsync} setToastList={setToastList} />} />
              </Routes>
            </div>
          </div>
          <Toast position="top-right" autoDelete={true} autoDeleteTime={2000} toastList={toastList} />
        </div>
      </LoadingHud>
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
