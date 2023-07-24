import React, { useCallback, useEffect, useState } from "react"
import spotifyWebApi, { spotifyWebApiUrl } from "../spotify/webApi";
import { connect } from "react-redux";
import { Playlist, SimplifiedPlaylist } from "spotify-types";
import Song from "../components/Song";

interface Props {
  user: IUser,
  app: IApp,
  query: string,
  searching: boolean,
  setQuery: Function,
  setToastList: Function
}

// TODO: search item

function SearchPage(props: Props) {
  type CategoryItem = { href: string, icons: { height: number, url: string, width: number }[], id: string, name: string };
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [searchResults, setSearchResults] = useState<Playlist[]>([]);

  const processSearch = useCallback(() => {
    if (props.query !== '' && props.query.length > 2) {
      const searchParams = new URLSearchParams();
      searchParams.append('q', props.query);
      searchParams.append('type', 'playlist');

      spotifyWebApi.fetchApi(`${spotifyWebApiUrl}/search?${searchParams.toString()}`, (access_token || ''))
        .then(function (response) {
          setSearchResults(response.data.playlists.items);
        }).catch(error => props.setToastList((list: Array<any>) => ([
          ...list, {
            id: 2,
            title: 'Error',
            description: 'Error occurred while connecting to spotify',
            backgroundColor: '#d9534f'
          }
        ])));

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.query]);

  useEffect(() => {
    props.query !== '' && processSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.query])



  const categoryColors = ['purplebox', 'redbox', 'orangebox', 'green-700', 'blue-600'];
  const access_token = props.app.spotifyAuth.access_token;
  const getSearchCategories = useCallback(async () => {
    spotifyWebApi.fetchApi(`${spotifyWebApiUrl}/browse/categories`, (access_token || ''))
      .then(function (response) {
        setCategories(response.data.categories.items);
      }).catch(error => props.setToastList((list: Array<any>) => ([
        ...list, {
          id: 2,
          title: 'Error',
          description: 'Error occurred while connecting to spotify',
          backgroundColor: '#d9534f'
        }
      ])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  useEffect(() => {
    getSearchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (props.searching) {
    return (<div>
      <h3 className='text-2xl text-white font-bold tracking-tight mb-4'>Searching in '<span className="text-blue-gray-400">Playlists</span>'</h3>
      <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6'>
        {searchResults.map((item, idx) => <Song item={item} key={idx} />)}
      </div>
    </div>)
  }

  return (<div>
    <div>
      <h3 className='text-2xl text-white font-bold tracking-tight mb-4'>Browse all</h3>
      <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
        {categories.map((item: CategoryItem, idx) => (
          <div key={idx} className='overflow-hidden' onClick={() => props.setQuery(item.name.toLowerCase())} >
            <div className={`bg-${categoryColors[Math.floor(Math.random() * (categoryColors.length - 2)) + 1]} h-[220px] rounded-lg p-4 relative`}>
              <span className='text-3xl font-bold'>{item.name}</span>
              <img className='w-[108px] h-[108px] -right-5 bottom-0 absolute rotate-25 shadow-2xl' src={item.icons[0].url} alt="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>)
}

export default connect((state: ApplState) => ({ user: state.user, app: state.app }))(SearchPage);