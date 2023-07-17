import React, { useEffect } from "react";
import PlayBox from "../components/PlayBox";
import Song from "../components/Song";
import { connect, useDispatch } from "react-redux";
import spotifyWebApi, { spotifyWebApiUrl } from "../spotify/webApi";
import { removeSpotifyAuth } from "../redux/actions";

interface Props {
  user: IUser,
  app: IApp,
  setToastList: Function
}

function SpotifyHome({ user, app, setToastList }: Props) {
  const [fetchDataTrigger, setFetchDataTrigger] = React.useState(0);
  const fetchDataIntervalId = React.useRef<NodeJS.Timer>();

  const dispatch = useDispatch();

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
    
    spotifyWebApi.fetchApi(`${spotifyWebApiUrl}/me/tracks`, (app.spotifyAuth.access_token || ''))
      .then((response) => {
        console.log(response.data);
      }).catch((error) => {
        if (error?.response.status === 401) {
          setToastList((list: Array<any>) => ([
            ...list, {
              id: 1,
              title: 'Error',
              description: 'Spotify Login Expired, connect spotify again',
              backgroundColor: '#d9534f'
            }
          ]))
          dispatch(removeSpotifyAuth({}));
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataTrigger]);

  const items = [
    {
      id: 1,
      title: 'Farketmeden',
      artist: 'Eren Yalçın',
      image: 'https://i.scdn.co/image/ab67616d00001e02e9c9fc7a8155861f8db6b28f',
      src: 'https://freesound.org/data/previews/617/617443_1648170-lq.mp3'
    },

    {
      id: 2,
      title: 'Uzunlar',
      artist: 'Evdeki Saat',
      image: 'https://i.scdn.co/image/ab67616d00001e02917b71d0a9aa3396f0031c40',
      src: 'https://freesound.org/data/previews/617/617382_7037-lq.mp3'
    },

    {
      id: 3,
      title: 'Kan',
      artist: 'UZI',
      image: 'https://i.scdn.co/image/ab67616d00001e0267c738a703dc979f5c3c52ef',
      src: 'https://freesound.org/data/previews/617/617306_5674468-lq.mp3'
    },

    {
      id: 4,
      title: 'Seni Kendime Sakladım',
      artist: 'Duman',
      image: 'https://i.scdn.co/image/ab67616d00001e02d5a587c7de8efc3ba32bede7',
      src: 'https://freesound.org/data/previews/617/617305_11861866-lq.mp3'
    },

    {
      id: 5,
      title: 'Seni Dert Etmeler',
      artist: 'Madrigal',
      image: 'https://i.scdn.co/image/ab67616d00001e029aa96c06d5c346ccf6ffaf8d',
      src: 'https://freesound.org/data/previews/617/617303_1015240-lq.mp3'
    },


  ]
  return (<>
    <div className='flex justify-between items-end mb-4'>
      <PlayBox title={'Recently Played - Spotify'} />
    </div>
    <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6'>
      {items.map(item => <Song item={item} key={item.id} />)}
    </div>

    <div className='flex justify-between items-end mb-4'>
      <PlayBox title={'Recently Added - Spotify'} />
    </div>
    <div className='grid grid-cols-5 gap-x-6'>
      {/* items go here */}
    </div>

    <div className='flex justify-between items-end mb-4'>
      <PlayBox title={'2000\'s Hot Hits'} />
    </div>
    <div className='grid grid-cols-5 gap-x-6'>
      {/* items go here */}
    </div>
  </>)
}

export default connect((state: ApplState) => (state))(SpotifyHome);