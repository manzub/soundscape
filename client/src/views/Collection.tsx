import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import CollectionItem from "../components/CollectionItem";
import { useNavigate } from "react-router-dom";
import { removeSpotifyAuth } from "../redux/actions";
import spotifyWebApi, { spotifyWebApiUrl } from "../spotify/webApi";
import appleMusicWebApi, { appleMusicWebApiUrl } from "../applemusic/webApi";

interface Props {
  user: IUser,
  app: IApp,
  setToastList: Function
}

function Collection(props: Props) {
  const { spotifyAuth, appleMusicAuth } = props.app;

  const [albumItems, setAlbumItems] = React.useState<any[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  interface albumProps { id: string, dateAdded: string, name: string, artwork: string | undefined, source: string };
  useEffect(() => {
    spotifyWebApi.fetchApi(`${spotifyWebApiUrl}/me/albums`, (spotifyAuth.access_token || ''))
      .then(response => {
        const albumItems = response.data.items.map((item: any) => ({ id: item.album.id, dateAdded: item.added_at, name: item.album.name, images: [{ url: item.album.images[0].url }], source: 'spotify' }));
        setAlbumItems(prev => [...prev, ...albumItems]);
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

    if (appleMusicAuth.loggedIn) {
      appleMusicWebApi.fetchApi(`${appleMusicWebApiUrl}/me/library/playlists`)
        .then(response => {
          console.log(response.data.items);
          const albumItems = response.data.data.map((item: any) => ({ id: item.id, dateAdded: item.attributes.dateAdded, name: item.attributes.name, images: [{ url: item.attributes.artwork.url }], source: 'applemusic' }));
          setAlbumItems(prev => [...prev, ...albumItems]);
        }).catch(error => {
          if (error?.response.status === 401) {
            props.setToastList((list: Array<any>) => ([
              ...list, {
                id: 1,
                title: 'Error',
                description: 'AppleMusic Login Expired, connect AppleMusic again',
                backgroundColor: '#d9534f'
              }
            ]))
            // TODO: remove apple music dispatch(removeSpotifyAuth({}));
            // navigate('/');
          }
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (<div>
    <div id="libPlaylists" className=" mb-14">
      <h3 className='text-2xl text-white font-bold tracking-tight mb-4'>Your Playlists</h3>
      <CollectionItem item={props.app.playlists} title="Saved Playlists" type="playlist" />
    </div>

    <div id="libAlbums" className=" mb-14">
      <h3 className='text-2xl text-white font-bold tracking-tight mb-4'>Library Albums</h3>
      <CollectionItem item={albumItems} title="Library Albums" type="song" />
    </div>
  </div>);
}


export default connect((state: ApplState) => ({ user: state.user, app: state.app }))(Collection);