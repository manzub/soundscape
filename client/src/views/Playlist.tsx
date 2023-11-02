import React, { useCallback, useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import './Playlist.css';
import { ArrowsRightLeftIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import spotifyWebApi, { spotifyWebApiUrl } from "../spotify/webApi";
import { connect, useSelector } from "react-redux";
import { SimplifiedPlaylist } from "spotify-types";
import musicPlaceholder from '../components/images/music-placeholder.svg';
import appleMusicWebApi, { appleMusicWebApiUrl } from "../applemusic/webApi";
import { UtilsContext } from "../utils/useContext";

// todo: get playlist from spotify api

function PlaylistItem() {
  const params = useParams();
  const { handleAsync, handleToastList } = useContext(UtilsContext);

  const { user, app } = useSelector((state: ApplState) => ({ user: state.user, app: state.app }));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [asyncState, setInAsync] = React.useState<boolean>(false);

  const [item, setItem] = React.useState<SimplifiedPlaylist>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [convertedTracks, setTracks] = React.useState<any[]>([]);

  const access_token = app.spotifyAuth.access_token;
  const getPlaylist = useCallback(async () => {
    if (params.source === 'applemusic') {
      appleMusicWebApi.fetchApi(`${appleMusicWebApiUrl}/catalog/uk/playlists/${params.id}`)
        .then(function (response) {
          console.log(response);
          // TODO: applemusic
        }).catch(error => handleToastList({
          title: 'Error',
          description: 'Error occurred while connecting to spotify',
          backgroundColor: '#d9534f'
        }))
    } else if (params.source === 'spotify') {
      spotifyWebApi.fetchApi(`${spotifyWebApiUrl}/playlists/${params.id}`, (access_token || ''))
        .then(function (response) {
          setItem(response.data);
        }).catch(error => handleToastList({
          title: 'Error',
          description: 'Error occurred while connecting to spotify',
          backgroundColor: '#d9534f'
        }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, access_token])

  useEffect(() => {
    getPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TODO: convert playlist
  async function convertTo() {
    if (window.confirm('Are you sure you want to proceed. This might take a while')) {
      handleAsync(!asyncState);

      if (params.source === 'spotify') {
        var asyncFunc = new Promise<void>((resolve, reject) => {
          item?.tracks.items.forEach(({ track }, index, array) => {
            // search with track names, artists, and other needed params
            const trackName = track?.name.split(" ").join("+");
            appleMusicWebApi.fetchApi(`${appleMusicWebApiUrl}/catalog/uk/search?term=${trackName}&limit=1&types=songs`)
              .then(function (response) {
                console.log(response.data.results.songs.data);
                // get the id. songs
                const convertedTrack = response.data.results.songs.data[0];
                // save the results to an array
                // then create a playlist from the completed array.
                setTracks(prev => ([...prev, { id: convertedTrack.id, type: convertedTrack.type }]))
              }).catch(error => handleToastList({
                title: 'Error',
                description: 'Error occurred, could not find song',
                backgroundColor: '#d9534f'
              }))

            // if last array item

            if (index === array.length - 1) {
              console.log(index);
              // end execution of the promise.
              resolve()
            }
          })
        })

        asyncFunc.then(() => {
          handleAsync(false);
          // do something after completed like create new playlist with these items
        })
      }
    }
  }



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