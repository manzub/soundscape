import { CheckIcon, ChevronUpDownIcon, InformationCircleIcon, PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { Alert, Button, Typography } from "@material-tailwind/react"
import React, { useEffect } from "react"
import userPlaceholder from '../components/images/user.png';
import { Combobox, Transition } from "@headlessui/react";
import spotifyWebApi, { spotifyWebApiUrl } from "../spotify/webApi";
import axios from "axios";
import { backendUrl } from "../utils/backendApi";
import { ConnectedProps, connect } from "react-redux";
import { getUserProfile } from "../redux/actions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

// TODO: fetch api when load 
const Profile: React.FC<ProfileProps> = (props) => {
  const { user, accessToken, setToastList, handleAsync } = props;
  const [inAsync, setAsyncState] = React.useState<boolean>(false);
  const [showForm, setFormState] = React.useState<boolean>(false);

  const [genres, setGenres] = React.useState<Array<string>>([]);
  const [selected, setSelected] = React.useState((genres[0] || ''))
  const [query, setQuery] = React.useState('')

  const filteredPeople =
    query === ''
      ? genres
      : genres.filter((genre: string) =>
        genre
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      );

  const savePreference = () => {
    setAsyncState(true);
    if (selected !== '') {
      axios.post(`${backendUrl}/me/profile/add-to-favorite-genres`, { email: user.email, genre: selected }).then(response => {
        if (response.data.status === 1) {
          setToastList((list: Array<any>) => ([
            ...list, {
              id: 1,
              title: 'Success',
              description: response.data.message,
              backgroundColor: '#5cb85c'
            }
          ]));
          props.getUserProfile((user.email || ''));
          setFormState(false)
          setSelected('');
        } else throw new Error(response.data.message);
      }).catch(error => setToastList((list: Array<any>) => ([
        ...list, {
          id: 2,
          title: 'Error',
          description: 'Could not save item',
          backgroundColor: '#d9534f'
        }
      ])))
    }
  }

  useEffect(() => {
    const getAvailableGenres = () => {
      if (accessToken !== '') {
        spotifyWebApi.fetchApi(`${spotifyWebApiUrl}/recommendations/available-genre-seeds`, (accessToken || '')).then(response => response.data).then(({ genres }: { genres: Array<string> }) => {
          setGenres(genres.filter(x => !user.profile?.preferences.genres.find(y => y === x)));
        }).catch(error => setToastList((list: Array<any>) => ([
          ...list, {
            id: 2,
            title: 'Error',
            description: 'Error occurred while connecting to spotify',
            backgroundColor: '#d9534f'
          }
        ])))
      }
    }
    genres.length === 0 && getAvailableGenres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genres]);

  useEffect(() => {
    handleAsync(inAsync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inAsync])


  return (
    <div>
      <div style={{ marginTop: '-64px' }}>
        <div className="flex relative overflow-hidden max-w-none text-white pb-4" style={{ height: '30vh', minHeight: '340px', maxHeight: '400px' }}>
          <div className="self-end" style={{ height: '192px', width: '192px', minWidth: '192px', marginInlineEnd: '24px' }}>
            <div className="flex relative" style={{ height: 'inherit' }}>
              <div className="w-full h-full">
                <img className="object-cover object-center w-full h-full rounded-md" src={userPlaceholder} alt="" />
              </div>
            </div>
          </div>
          <div className="flex justify-end flex-1" style={{ flexFlow: 'column' }}>
            <span className="eoWRdH">Profile</span>
            <span className="rEN7ncpaUeSGL9z0NGQR">
              <button className="wCkmVGEQh3je1hrbsFBY" title="Edit details">
                <span className="o4KVKZmeHsoRZ2Ltl078">
                  <h1 className="dYGhLW" style={{ margin: '0.08em 0px 0.12em', visibility: 'visible', width: '100%', fontSize: '3rem' }}>Wizz Dom</h1>
                </span>
              </button>
            </span>
            <div className="flex items-center flex-wrap" style={{ marginTop: '8px' }}>1 Public Playlist</div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 mt-4">
          <span className="bRsiqD uppercase">preferences</span>

          <div className="flex w-full flex-col gap-2">
            <Alert className="bg-[#2ec946]/10 text-[#2ec946] border-l-4 border-[#2ec946] rounded-none font-medium"
              icon={<InformationCircleIcon className="h-6 w-6" />}>
              <Typography variant="h5" color="white" className="font-bold capitalize">Edit personalised information about your user profile</Typography>
              <Typography color="white" className="mt-2 font-medium">
                Changes you make to your profile affect your online preference and what other users see. To change what other users see, change items from public to private to hide them from other users.
              </Typography>
            </Alert>
          </div>

          <div className="prefs-item flex w-full flex-col gap-2">
            <div className="relative flex items-center h-16">
              <h3 className="text-lg text-gray-400 font-bold">Favorite Genres</h3>
              <Button onClick={() => setFormState(!showForm)} variant="text" color="white" size="sm" className="!absolute top-3 right-3">
                {showForm ? <XMarkIcon style={{ display: 'initial' }} className="mt-px h-6 w-6" /> : <PlusIcon style={{ display: 'initial' }} className="mt-px h-6 w-6" />}
              </Button>
            </div>

            <div>
              <ul>
                {user.profile?.preferences.genres.map((item, idx) => (<li key={idx}>
                  {item} <button><TrashIcon className="h-6 w-6" /></button>
                </li>))}
                <li>R&B <button><TrashIcon className="h-6 w-6" /></button></li>
                <li>R&B <button><TrashIcon className="h-6 w-6" /></button></li>
              </ul>
              {showForm && <div className="flex w-full">
                <Combobox value={selected} onChange={setSelected}>
                  <div className="flex-1 relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <Combobox.Input className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0" displayValue={(genre: string) => genre} onChange={(event) => setQuery(event.target.value)} />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </Combobox.Button>
                    </div>
                    <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')} >
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPeople.length === 0 && query !== '' ? (<div className="relative cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>) : (
                          filteredPeople.map((genre, idx) => (
                            <Combobox.Option key={idx} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'}`} value={genre}>
                              {({ selected, active }) => (<>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{genre}</span>
                                {selected ? (<span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'}`}>
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>) : null}
                              </>)}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
                <button onClick={savePreference}>
                  <PlusIcon className="h-6 w-6" />
                </button>
              </div>}
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

interface Props {
  handleAsync: Function,
  setToastList: Function
}

const mapStateToProps = (state: ApplState, ownProps: Props) => ({
  user: state.user, accessToken: state.app.spotifyAuth.access_token, ...ownProps
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, void, AnyAction>) => ({
  getUserProfile: (email: string) => dispatch(getUserProfile(email))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type ProfileProps = ConnectedProps<typeof connector>


export default connector(Profile);