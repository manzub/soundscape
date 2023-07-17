const clientId = process.env.REACT_APP_SPOTIFY_CCID;

const spotifyLogin = {
  loginWithSpotify: () => {
    let scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-recently-played',
      'user-library-modify',
      'user-follow-modify',
      'user-library-read',
      'user-read-recently-played',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-top-read'
    ].join(' ');
    let scopes_encoded = scopes.replace(' ', '%20');
    let redirectUri = 'http://localhost:3000/';

    window.location.href = [
      'https://accounts.spotify.com/authorize',
      `?client_id=${clientId}`,
      `&redirect_uri=${redirectUri}`,
      `&scope=${scopes_encoded}`,
      '&response_type=token',
      '&show_dialog=true'
    ].join('');
  }
}

export default spotifyLogin;