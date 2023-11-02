import React, { useContext } from 'react';
import logo from './images/logo.svg';
import { Icon } from "./Icons";
import Menu from './Header/Menu';
import Playlist from './Header/Playlist';
import DownloadApp from './Header/DownloadApp';
import { NavLink, useNavigate } from 'react-router-dom';
import spotifyLogin from '../spotify/login';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { removeSpotifyAuth } from '../redux/actions';


export default function Header() {
  const { app, user } = useSelector(((state: ApplState) => ({ app: state.app, user: state.user })), shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSpotifyButton = () => {
    if (app.spotifyAuth.access_token) {
      if (window.confirm('Do you want to disconnect spotify')) {
        dispatch(removeSpotifyAuth({}));
        navigate('/');
      }
    } else spotifyLogin.loginWithSpotify();
  }

  return (
    <div className="w-60 pt-6 bg-black flex flex-col flex-shrink-0">
      <NavLink to="/" className='mb-7 px-6'>
        <img className='h-10 w-auto' alt='home' src={logo} />
      </NavLink>

      <Menu />
      <nav className='mt-8 px-6'>
        <ul>
          <li>
            <a className="flex items-center gap-x-3 text-sm font-bold text-link hover:text-white transition-colors group" href="#s">
              <span className='bg-white p-[6px] bg-opacity-70 group-hover:bg-opacity-90'>
                <Icon name="plus" />
              </span>
              Create PlayList
            </a>
            <span onClick={handleSpotifyButton} className={classNames("flex items-center gap-x-3 text-sm font-bold text-link hover:text-white mt-4 transition-colors group", { "bg-gray-300": !app.spotifyAuth.access_token, "bg-active border-red-400 border-x-2": app.spotifyAuth.access_token })}>
              <span className='bg-black p-[6px] opacity-70 group-hover:opacity-90'>
                <Icon name="external" />
              </span>
              {app.spotifyAuth.access_token != null ? 'Disconnect Spotify' : 'Connect Spotify'}
            </span>
            <a className="flex items-center gap-x-3 text-sm font-bold text-link hover:text-white mt-4 transition-colors group " href="#s">
              <span className='bg-black p-[6px] opacity-70 group-hover:opacity-90'>
                <Icon name="shuffle" />
              </span>
              Connect Apple Music
            </a>
          </li>
        </ul>
        <div className="h-[1px] bg-active mt-5"></div>
      </nav>
      <nav className='px-6 pt-3 overflow-y-auto scrollbar-hide'>
        <Playlist user={user} />
      </nav>
      <span className='px-6 pt-3 '><DownloadApp /></span>
    </div>
  )
}