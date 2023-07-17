import axios from "axios";
import * as actionTypes from "./actionTypes";
import { backendUrl } from "../utils/backendApi";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

export const logoutUser = () => ({ type: actionTypes.SIGN_OUT });
export const signInUser = (payload: any) => ({ type: actionTypes.SIGN_IN, payload })
export const saveSpotifyAuth = (payload: any) => ({ type: actionTypes.SPOTIFY_AUTH, payload })
export const removeSpotifyAuth = (payload: any) => ({ type: actionTypes.SPOTIFY_LOGOUT, payload })
export const clearAppState = () => ({ type: actionTypes.CLEAR_APP })
export const savePlaylist = (payload: any) => ({ type: actionTypes.SAVE_PLAYLIST, payload })
export const getUserProfile = (email: string) => async (dispatch: ThunkDispatch<any, void, AnyAction>) => {
  const response = (await axios.get(`${backendUrl}/me/profile/${email}`)).data
  if (response.status === 1) {
    dispatch({ type: actionTypes.GET_USER_PROFILE, payload: response.data })
  }
}