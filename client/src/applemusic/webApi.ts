import axios from "axios";

export const appleMusicWebApiUrl = "https://api.music.apple.com/v1/";

const appleMusicWebApi = {
  fetchApi: async (url: string) => {
    const developer_token = process.env.REACT_APP_DEVELOPER_TOKEN;
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + developer_token,
        "Content-Type": "application/json"
      }
    })
    return response;
  }
}

export default appleMusicWebApi;