import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import spotifyWebApi, { spotifyWebApiUrl } from '../../spotify/webApi';
import { removeSpotifyAuth, savePlaylist } from '../../redux/actions';
import musicPlaceholder from '../images/music-placeholder.svg';
import { useNavigate } from 'react-router-dom';

interface Props {
  setToastList: Function,
  user: IUser
}

export default function Playlist(props: Props) {
  const { spotifyAuth, playlists } = useSelector((state: ApplState) => state.app, shallowEqual);
  const [fetchDataTrigger, setFetchDataTrigger] = React.useState(0);
  const fetchDataIntervalId = React.useRef<NodeJS.Timer>();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setFetchDataInterval = (interval: any) => {
    // Clear old interval
    if (fetchDataIntervalId.current) {
      clearInterval(fetchDataIntervalId.current);
      fetchDataIntervalId.current = undefined;
    }

    // Set new interval
    if (interval > 0) {
      fetchDataIntervalId.current = setInterval(() => {
        setFetchDataTrigger(Date.now());
      }, interval);
    }
  };

  useEffect(() => {
    spotifyWebApi.fetchApi(`${spotifyWebApiUrl}/me/playlists`, (spotifyAuth.access_token || ''))
      .then(response => {
        interface playlistProps { name: string, images: Array<{ url: string }>, id: string };
        const playlists = response.data.items.map(({ name, images, id }: playlistProps) => ({ name, id, images, owner: props.user.username, source: 'spotify' }));

        dispatch(savePlaylist(playlists));
      }).catch(error => {
        if (error?.response.status === 401) {
          props.setToastList((list: Array<any>) => ([
            ...list, {
              id: 1,
              title: 'Error',
              description: 'Spotify Login Expired, connect spotify again',
              backgroundColor: '#d9534f'
            }
          ]))
          dispatch(removeSpotifyAuth({}));
          navigate('/');
        }
      })

    // Clean up for unmount to prevent memory leak
    return () => clearInterval(fetchDataIntervalId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataTrigger]);


  useEffect(() => {
    setFetchDataInterval(3000);
  }, [])

  return (
    <nav className='flex'>
      <ul>
        {playlists.map((item) => (
          <li className='mb-2' key={item.id}>
            <a href="#s" className='text-link hover:text-white text-sm font-semibold'>
              <div className='flex gap-2 items-center justify-items-center'>
                <img src={item.images.length > 0 ? item.images[0].url : musicPlaceholder} className="h-14 w-14 p-3 rounded-lg bg-gray-900 shadow-md" alt='playlist cover' />
                <div>
                  <h6>{item.name}</h6>
                  <p className='font-thin font-sans capitalize'>{item.source} . {item.owner}</p>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </nav>

  )
}