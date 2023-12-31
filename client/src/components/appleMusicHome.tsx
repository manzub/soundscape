import React, { useContext, useEffect } from "react";
import { connect, shallowEqual, useSelector } from "react-redux"
import PlayBox from "./PlayBox";
import Song from "./Song";
import appleMusicWebApi, { appleMusicWebApiUrl } from "../applemusic/webApi";
import { UtilsContext } from "../utils/useContext";


function AppleMusicHome() {
  const { handleToastList } = useContext(UtilsContext);

  const { app } = useSelector((state: ApplState) => ({ app: state.app }), shallowEqual);

  const [fetchDataTrigger, setFetchDataTrigger] = React.useState(0);
  const fetchDataIntervalId = React.useRef<NodeJS.Timer>();

  interface PlayboxItems { charts: Array<any> };
  const [items, setState] = React.useState<PlayboxItems>({ charts: [] });



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
    if (app.appleMusicAuth.loggedIn) {
      const urls = [{ apiUrl: `${appleMusicWebApiUrl}/catalog/us/playlists?filter[storefront-chart]=us`, name: 'charts' }];
      urls.forEach(function (applemusicItem) {
        appleMusicWebApi.fetchApi(applemusicItem.apiUrl)
          .then(response => {
            const apItems: Array<any> = response.data.data.map((item: any) => ({ ...item, source: 'applemusic' }));

            setState({ ...items, [applemusicItem.name]: apItems });
          }).catch((error) => {
            if (error?.response.status === 401) {
              handleToastList({
                title: 'Error',
                description: 'AppleMusic Login Expired, connect again',
                backgroundColor: '#d9534f'
              })
              // dispatch(removeSpotifyAuth({}));
              // navigate('/');
            }
          })
      })
    }

    // Clean up for unmount to prevent memory leak
    return () => clearInterval(fetchDataIntervalId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataTrigger]);


  useEffect(() => {
    setFetchDataInterval(5000);
  }, [])

  return (<>
    <div id="featuredDiv" className='flex justify-between items-end mb-4'>
      <PlayBox title={'Charts - AppleMusic'} />
    </div>
    <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6'>
      {items?.charts.map((item, idx) => (item != null && <Song item={item} key={idx} />))}
    </div>
  </>)
}

export default connect((state: ApplState) => ({ user: state.user, app: state.app }))(AppleMusicHome);