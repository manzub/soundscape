import React from 'react';
import { Menu } from '@headlessui/react'
import placeholderPerson from '../images/user.png';
import { Icon } from '../Icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { clearAppState, logoutUser } from '../../redux/actions';

interface Props {
  user: IUser,
  app: IApp
}

function User({ user, app }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const person = {
    name: user.username,
    avatar: '../images/user.png'

  }

  const handleSignOut = async () => {
    if (user.loggedIn) {
      if (window.confirm('Are you sure?')) {
        // remove user state
        dispatch(clearAppState());
        dispatch(logoutUser());
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    }
  }

  return (
    <Menu as="nav" className={"relative"}>
      {({ open }) => (
        <>
          <Menu.Button className={`flex items-center gap-x-[6px] rounded-[23px] p-1 ${open ? 'bg-active' : 'bg-brenk'}`}>
            <img className='w-[28px] h-[28px] rounded-full' alt='' src={placeholderPerson} />
            <span className='text-sm font-semibold'>{person.name}</span>
            <span className={open === true ? 'rotate-180' : ''}>
              <Icon name="dir" />
            </span>
          </Menu.Button>
          <Menu.Items className="absolute p-1 top-full right-0 w-48 bg-active rounded translate-y-2 z-10">
            <Menu.Item>
              {({ active }) => (
                <NavLink className={`h-10 flex px-2 text-sm font-semibold justify-between text-white opacity-80 items-center ${active && 'bg-menubg'}`} to="/profile">
                  Profile
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a className={`h-10 flex px-2 text-sm font-semibold justify-between text-white opacity-80 items-center ${active && 'bg-menubg'}`} href="/#" >
                  Upgrade to Premium
                  <Icon name="external" />
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div onClick={handleSignOut} className={`h-10 flex px-2 text-sm font-semibold justify-between text-white opacity-80 items-center ${active && 'bg-menubg'}`}>
                  Sign Out
                </div>
              )}
            </Menu.Item>


          </Menu.Items>
        </>
      )}
    </Menu>
  )
}

export default connect((state: ApplState) => (state))(User);