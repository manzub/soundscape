interface IUser {
  userid?: string,
  username?: string,
  email?: string,
  profile?: {
    preferences: {
      genres: Array<string>,
      favArtists: Array
    }
  },
  loggedIn: boolean
}

type UserAction = {
  type: string,
  payload: any
}

type UserState = {
  user: IUser
}

interface IApp {
  spotifyAuth: { access_token?: string, expires_in?: string, token_type?: string },
  playlists: Array<{ name: string, id: string, images: Array<{url:string}>, owner: string, source: string }>
}

type AppAction = {
  type: string,
  payload: any
}


type ApplState = {
  user: IUser,
  app: IApp
}


type DispatchType = (args: UserAction) => UserAction;