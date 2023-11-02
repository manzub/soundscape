import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './views/Home';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Login from './views/Login';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import LoadingHud from './components/LoadingHud';
import Register from './views/Register';
import { appleMusicLgn, saveSpotifyAuth } from './redux/actions';
import Profile from './views/Profile';
import Toast from './components/Toast/Toast';
import Playlist from './views/Playlist';
import spotifyLogin from './spotify/login';
import SearchPage from './views/Search';
import Collection from './views/Collection';
import { UtilsContext } from './utils/useContext';


function App(props: { musicInstance: any }) {
  const [toastList, setToastList] = React.useState<Array<any>>([]);
  const [inAsync, setAsyncState] = React.useState<boolean>(false);
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [searching, setSearching] = React.useState<boolean>(false);

  const { user, app } = useSelector((state: ApplState) => ({ user: state.user, app: state.app }), shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let musicInstance = props.musicInstance;


  const handleAsync = (state: boolean) => {
    setAsyncState(state);
  }

  const handleToastList = (props: { title: string, description: string, color: string }) => {
    setToastList([
      ...toastList, {
        id: 1,
        title: props.title,
        description: props.description,
        backgroundColor: props.color
      }
    ])
  }

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
  }

  async function authoriseMusicKit() {
    await musicInstance.authorize();
    dispatch(appleMusicLgn());
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
    if (musicInstance && musicInstance.isAuthorized) {
      dispatch(appleMusicLgn()) // todo update state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    if (!app.spotifyAuth.access_token || app.appleMusicAuth.loggedIn) {
      return (
        <LoadingHud active={inAsync}>
          <div className=''>
            <div className="login">
              <img src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
                alt="" />
              <div className='lgn_btn flex flex-col gap-4'>
                <button onClick={spotifyLogin.loginWithSpotify} disabled={!!app.spotifyAuth.access_token} className='spotify_lgn'>Connect Spotify</button>
                <button onClick={authoriseMusicKit} className='ios_lgn'>Connect AppleMusic</button>
              </div>
            </div>
          </div>
        </LoadingHud>
      )
    }

    return (
      <LoadingHud active={inAsync}>
        <UtilsContext.Provider value={{ handleAsync, handleToastList, handleSearchQuery }}>
          <div className="wrapper">
            <Header />
            <div className='flex-auto overflow-auto'>
              <Navbar query={searchQuery} />
              <div className='px-8 pt-5'>
                <Routes>
                  <Route path='/' element={<Home user={user} />} />
                  <Route path='/search' element={<SearchPage query={searchQuery} searching={searching} />} />
                  <Route path='/collection' element={<Collection />} />
                  <Route path='/playlist/:source/:id' element={<Playlist />} />
                  <Route path='/profile' element={<Profile />} />
                </Routes>
              </div>
            </div>
            <Toast position="top-right" autoDelete={true} autoDeleteTime={2000} toastList={toastList} />
          </div>
        </UtilsContext.Provider>
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
              <Route path='/register' element={<Register />} />
              <Route path='*' element={<Login />} />
            </Routes>
          </div>
        </div>
        <Toast position="top-right" autoDelete={true} autoDeleteTime={2000} toastList={toastList} />
      </div>
    </LoadingHud>
  )
}

export default App;
