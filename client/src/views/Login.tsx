import React, { useCallback, useContext, useEffect, useRef } from "react"
import { NavLink } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import classNames from "classnames";
import axios from "axios";
import { backendUrl } from "../utils/backendApi";
import { useDispatch } from "react-redux";
import { signInUser } from "../redux/actions";
import Toast from "../components/Toast/Toast";
import { UtilsContext } from "../utils/useContext";

interface LoginForm {
  emailusername: string,
  password: string,
  usedOneTap: boolean
}

export default function Login() {
  const { handleAsync, handleToastList } = useContext(UtilsContext);

  const [inAsync, setAsyncState] = React.useState<boolean>(false);
  const [ggToken, setCredentials] = React.useState<string>();

  let defaultForm: LoginForm = { emailusername: '', password: '', usedOneTap: false };
  const [form, updateForm] = React.useState<LoginForm>(defaultForm);
  const [toastList, setToastList] = React.useState<Array<any>>([]);
  const [passwordRefState, togglePassword] = React.useState<boolean>(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const googleLogin = useGoogleLogin({
    onSuccess: function (tokenResponse) {
      setCredentials(tokenResponse.access_token);
      // passwordRef.current && passwordRef.current.focus();
    },
    onError: function (errorResponse) {
      setAsyncState(!inAsync);
      console.log(errorResponse);
    },
    flow: 'implicit'
  })

  const processSubmit = useCallback((form: LoginForm) => {
    interface ResponseData { status: number, message: string, data: any }
    axios.post(`${backendUrl}/auth/login-user`, form).then(response => response.data).then((userData: ResponseData) => {
      if (userData.status === 1) {
        setToastList(list => ([
          ...list, {
            id: 1,
            title: 'Success',
            description: userData.message,
            backgroundColor: '#5cb85c'
          }
        ]));
        setTimeout(() => {
          setAsyncState(false);
          dispatch(signInUser({ ...userData.data, loggedIn: true }));
        }, 2500);
      } else {
        setToastList(list => ([
          ...list, {
            id: 1,
            title: 'Error',
            description: userData.message,
            backgroundColor: '#d9534f'
          }
        ]));
        setTimeout(() => {
          setAsyncState(false);
        }, 2500);
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ggToken) {
      const googleProfileUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${ggToken}`;
      axios.get(googleProfileUrl).then(response => response.data).then(credentials => updateForm(f => ({ ...f, emailusername: credentials.email, usedOneTap: true })));
    }
  }, [ggToken]);

  useEffect(() => {
    if (form.usedOneTap) processSubmit(form);
  }, [form, processSubmit])

  useEffect(() => {
    handleAsync(inAsync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inAsync])

  return (
    <div className='login-container flexed'>
      <h1 className="title title-pos">Log in to Soundscape</h1>
      <ul className="login-options login-options-pos flexed">
        <li className="login-item">

          <button onClick={() => { setAsyncState(true); googleLogin() }} className="login-opt-button mb-2 sc-jIRcFI kytqHe">
            <span className="gg-icon"></span>
            <span className="itlAHd gjBoil eTMXUY">Continue with Google</span>
          </button>
        </li>
      </ul>
      <hr className="OEwmv" />
      <div className="kWRxyd bGYVrs">
        <div className="eoRzGN eokstg">
          <div className="duTSXm">
            <label className="cwWhaQ" htmlFor="">
              <span className="LnTCl">Email or Username</span>
            </label>
          </div>
          <input
            aria-invalid="false"
            type="text"
            value={form.emailusername}
            disabled={!!(ggToken && form.emailusername)}
            onChange={({ target }) => updateForm({ ...form, emailusername: target.value.trim() })}
            placeholder="Email or username"
            autoCapitalize="off"
            autoComplete="username"
            spellCheck="false"
            autoCorrect="off" className="fOpTaL" />
        </div>
        <div className="eoRzGN eokstg">
          <div className="duTSXm">
            <label className="cwWhaQ" htmlFor="">
              <span className="LnTCl">Password</span>
            </label>
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              aria-invalid="false"
              type={passwordRefState ? "text" : 'password'}
              ref={passwordRef}
              value={form.password}
              onChange={({ target }) => updateForm({ ...form, password: target.value.trim() })}
              placeholder="Password"
              autoCapitalize="off"
              autoComplete="new-password"
              spellCheck="false"
              autoCorrect="off" className="fOpTaL" />
            <div className="huaAbB">
              <button onClick={() => togglePassword(!passwordRefState)} className="Button-sc-1dqy6lx-0 eMFxEP">
                <span aria-hidden="true" className="eJHlti">
                  <svg width="24" height="24" className="uPxdw" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="miter"><path d="M17.86,18.14l-.44.32-.48.29-.51.27c-.17.08-.35.17-.54.24l-.56.22-.6.18-.63.14-.67.11-.7.07L12,20l-.73,0-.7-.07L9.9,19.8l-.63-.14-.6-.18-.56-.22c-.19-.07-.37-.16-.54-.24l-.51-.27-.48-.29-.44-.32a4.46,4.46,0,0,1-.43-.33l-.39-.34L5,17.11l-.34-.36c-.11-.13-.22-.25-.32-.38L4,16l-.27-.37-.25-.38c-.08-.12-.15-.24-.22-.36l-.21-.36-.18-.34-.16-.33-.15-.32-.12-.29c0-.09-.08-.18-.11-.27l-.09-.24c0-.08-.06-.15-.08-.22l-.06-.18a1,1,0,0,1,0-.14.76.76,0,0,1,0-.11V12l0-.07a.76.76,0,0,1,0-.11l.06-.14.08-.18c0-.07.07-.14.1-.22L2.44,11c0-.09.09-.18.14-.27l.15-.29.18-.32C3,10,3,9.93,3.1,9.81l.22-.34c.07-.12.15-.24.23-.36l.26-.36c.08-.13.18-.25.27-.38L4.37,8l.32-.37L5,7.25l.35-.36.38-.36.4-.34"></path><path d="M10.14,4.2l.59-.11L11.36,4,12,4l.64,0,.63.07.59.11.58.14.55.18.53.22c.17.07.34.16.51.24l.49.27.46.29.44.32.42.33.4.34.38.36.35.36.34.38c.11.12.21.24.31.37s.2.25.3.37.19.25.27.38l.26.36c.08.12.16.24.23.36l.22.34c.06.12.13.23.19.33l.18.32.15.29c0,.09.1.18.14.27l.12.24c0,.08.07.15.1.22l.08.18.06.14a.76.76,0,0,1,0,.11L22,12v.11a.76.76,0,0,1,0,.11,1,1,0,0,1,0,.14l-.06.18c0,.07-.05.14-.08.22s-.06.16-.09.24-.07.18-.11.27l-.12.29-.15.32-.16.33-.18.34-.21.36"></path><path d="M14.83,14.83A4,4,0,0,1,9.17,9.17"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="lgn-btn">
          <button onClick={() => { setAsyncState(true); processSubmit(form); }} disabled={(form.emailusername === '' || form.password === '')} className="otMlU" style={{ width: '100%' }}>
            <span className={classNames("cJdEzG", { "bg-green-300 cursor-not-allowed": (form.emailusername === '' || form.password === '') })}>
              <span className="cOJqPq itlAHd dbTuyj">Log In</span>
            </span>
            <span className="csWrjt"></span>
          </button>
        </div>
        <div className="EYhyD zySKg PPwIs">
          <NavLink to="/forgot-password" className="Link-sc-k8gsk-0 cIqjxr">
            <p className="eRYMpa sc-bqWxrE iJlXnD">Forgot your password?</p>
          </NavLink>
        </div>
      </div>
      <div className="sign-up-section" style={{ paddingTop: '16px' }}>
        <h2 className="text-center jjFhCE">
          <span className="fnlBsz">Don't have an account?</span>
          <NavLink to={'/register'} className="cIqjxr sc-cCjUiG jOZNXz">
            <span className="eRYMpa cLcPxy">Sign up for Soundscape</span>
          </NavLink>
        </h2>
      </div>
      <Toast position="top-right" autoDelete={true} autoDeleteTime={2000} toastList={toastList} />
    </div>
  )
}