import * as actionTypes from "./actionTypes";

const initialUser: UserState = { user: { loggedIn: false } }
export function userReducer(state: IUser = initialUser.user, action: UserAction): IUser {
  // Clone state object
  let newState = Object.assign({}, state);

  switch (action.type) {
    case actionTypes.SIGN_IN:
      newState = action.payload;
      break;
    case actionTypes.SIGN_OUT:
      newState = initialUser.user;
      break;
    case actionTypes.GET_USER_PROFILE:
      newState = { ...state, profile: action.payload }
      break;
    default:
      break;
  }
  return newState;
}

const initialState: IApp = { spotifyAuth: {}, appleMusicAuth: { loggedIn: false }, playlists: [] }
export function appReducer(state = initialState, action: AppAction) {
  // Clone state object
  let newState = Object.assign({}, state);
  // newState = initialState;
  switch (action.type) {
    case actionTypes.SPOTIFY_AUTH:
      const expiryDate = (Date.now() + action.payload.expires_in * 1000);
      const expires_in = new Date(expiryDate).toString();
      newState = { ...state, spotifyAuth: { ...action.payload, expires_in } };
      break;
    case actionTypes.SPOTIFY_LOGOUT:
      newState = { ...state, spotifyAuth: initialState.spotifyAuth };
      break;
    case actionTypes.SAVE_PLAYLIST:
      newState = { ...state, playlists: [...action.payload] }
      break;
    case actionTypes.CLEAR_APP:
      newState = initialState;
      break;
    default:
      break;
  }
  return newState
}