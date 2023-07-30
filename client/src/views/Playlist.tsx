import React, { useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import './Playlist.css';
import { ArrowsRightLeftIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import spotifyWebApi, { spotifyWebApiUrl } from "../spotify/webApi";
import { connect } from "react-redux";
import { SimplifiedPlaylist } from "spotify-types";
import musicPlaceholder from '../components/images/music-placeholder.svg';
import appleMusicWebApi, { appleMusicWebApiUrl } from "../applemusic/webApi";

// todo: get playlist from spotify api

interface Props {
  user: IUser,
  app: IApp,
  setToastList: Function,
  handleAsync: Function
}

function PlaylistItem({ user, app, setToastList, handleAsync }: Props) {
  const params = useParams();

  const [asyncState, setInAsync] = React.useState<boolean>(false);

  const [item, setItem] = React.useState<SimplifiedPlaylist>();

  const access_token = app.spotifyAuth.access_token;
  const getPlaylist = useCallback(async () => {
    if (params.source === 'applemusic') {
      appleMusicWebApi.fetchApi(`${appleMusicWebApiUrl}/catalog/uk/playlists/${params.id}`)
        .then(function (response) {
          console.log(response);
          // TODO: applemusic
        }).catch(error => setToastList((list: Array<any>) => ([
          ...list, {
            id: 2,
            title: 'Error',
            description: 'Error occurred while connecting to spotify',
            backgroundColor: '#d9534f'
          }
        ])))
    } else if (params.source === 'spotify') {
      spotifyWebApi.fetchApi(`${spotifyWebApiUrl}/playlists/${params.id}`, (access_token || ''))
        .then(function (response) {
          setItem(response.data);
        }).catch(error => setToastList((list: Array<any>) => ([
          ...list, {
            id: 2,
            title: 'Error',
            description: 'Error occurred while connecting to spotify',
            backgroundColor: '#d9534f'
          }
        ])))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, access_token])

  useEffect(() => {
    getPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function convertTo() {
    if (window.confirm('Are you sure you want to proceed. This might take a while')) {
      handleAsync(!asyncState);

      if (params.source === 'spotify') {
        item?.tracks.items.forEach(function ({ track }) {
          
        })
      }
    }
  }

  console.log(item);



  return (<div className="body">
    <div className="body__info">
      <img src={(item?.images && item.images.length > 0) ? item?.images[0].url : musicPlaceholder} alt="" />
      <div className="body__infoText">
        <strong>PLAYLIST</strong>
        <h2>{item?.name}</h2>
        <p>{item?.description}</p>
      </div>
    </div>
    <div className="body__songs">
      <div className="body__icons">
        <PlayCircleIcon className="body__shuffle h-20 mr-4" />
        {/* TODO: conver to id */}
        <ArrowsRightLeftIcon onClick={convertTo} title="Convert To " className="h-16 hover:h-20" />
      </div>

      {/* List of Songs */}
      {item?.tracks.items.map((item, idx) => (
        <div className="songRow" key={idx}>
          <img className="songRow__album" src={item.track?.album.images[0].url} alt="" />
          <div className="songRow__info">
            <h1>{item.track?.name}</h1>
            <p>
              {item.track?.artists.map((artist) => artist.name).join(", ")} - {" "}
              {item.track?.album.name}
            </p>
          </div>

        </div>
      ))}

    </div>
  </div>)
}

export default connect((state: ApplState) => ({ user: state.user, app: state.app }))(PlaylistItem);