import axios from "axios";

export const spotifyWebApiUrl = "https://api.spotify.com/v1";

const spotifyWebApi = {
  fetchApi: async (url: string, accessToken: string) => {
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      }
    })
    return response;
  }
}

export default spotifyWebApi;