import React from 'react';
import ReactDOM from 'react-dom/client';
import './custom.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './redux';
import { ThemeProvider } from '@material-tailwind/react';
import MusicProvider from './applemusic/musicKit';

const clientId = process.env.REACT_APP_GG_CLIENTID || '';
let musicInstance = null;

let musicProvider = MusicProvider.sharedProvider();

try {
  musicProvider.configure();
  musicInstance = musicProvider.getMusicInstance();
} catch (error) {
  console.log(error);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.Fragment>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <Provider store={store}>
          <BrowserRouter>
            <App musicInstance={musicInstance} />
          </BrowserRouter>
        </Provider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
