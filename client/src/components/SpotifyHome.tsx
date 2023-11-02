import React, { useContext, useEffect } from "react";
import PlayBox from "./PlayBox";
import Song from "./Song";
import { connect, shallowEqual, useDispatch, useSelector } from "react-redux";
import spotifyWebApi, { spotifyWebApiUrl } from "../spotify/webApi";
import { removeSpotifyAuth } from "../redux/actions";
import { Playlist } from "spotify-types";
import { useNavigate } from "react-router-dom";
import { UtilsContext } from "../utils/useContext";

function SpotifyHome() {
  const { handleToastList } = useContext(UtilsContext);

  const [fetchDataTrigger, setFetchDataTrigger] = React.useState(0);
  const fetchDataIntervalId = React.useRef<NodeJS.Timer>();

  interface PlayboxItems { featured: Array<Playlist> };
  const [items, setState] = React.useState<PlayboxItems>({ featured: [] });

  const { app } = useSelector((state: ApplState) => ({ app: state.app }), shallowEqual);
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
    const urls = [{ apiUrl: `${spotifyWebApiUrl}/browse/featured-playlists`, name: 'featured' }];
    urls.forEach(function (spotifyItem) {
      spotifyWebApi.fetchApi(spotifyItem.apiUrl, (app.spotifyAuth.access_token || ''))
        .then((response) => {
          const apItems: Array<Playlist> = response.data.playlists.items.map((item: Playlist) => ({ ...item, source: 'spotify' }));
          setState({ ...items, [spotifyItem.name]: apItems });
        }).catch((error) => {
          if (error?.response.status === 401) {
            handleToastList({
              title: 'Error',
              description: 'Spotify Login Expired, connect spotify again',
              backgroundColor: '#d9534f'
            })
            dispatch(removeSpotifyAuth({}));
            navigate('/');
          }
        })
    })

    // Clean up for unmount to prevent memory leak
    return () => clearInterval(fetchDataIntervalId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataTrigger]);

  useEffect(() => {
    setFetchDataInterval(5000);
  }, [])

  return (<>
    <div id="featuredDiv" className='flex justify-between items-end mb-4'>
      <PlayBox title={'Featured Playlists - Spotify'} />
    </div>
    <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6'>
      {items?.featured.map((item, idx) => (item != null && <Song item={item} key={idx} />))}
    </div>
  </>)
}

export default connect((state: ApplState) => (state))(SpotifyHome);