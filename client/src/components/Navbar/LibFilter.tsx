import React from 'react';
import { NavLink } from 'react-router-dom';

export default function LibFilter() {

  function handleNav(e: React.MouseEvent, linkTo: string) {
    e.preventDefault();
    document.querySelector(linkTo)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className='mr-auto ml-4 relative'>
      <ul className='flex gap-x-4'>
        <li>
          <NavLink className={(isActive) => {
            let styles = ["p-3 rounded"];
            if (isActive) styles.push("bg-topbutton p-3 rounded");
            return styles.join("");
          }} onClick={(e) => handleNav(e, 'libPlaylists')} to={"/collection"}>
            <button className='font-semibold text-white active:bg-brenk leading-4 text-[15px] tracking-wide'>
              Playlists
            </button>
          </NavLink>
        </li>
        <li>
          <NavLink className={(isActive) => {
            let styles = ["p-3 rounded"];
            if (isActive) styles.push("bg-topbutton p-3 rounded");
            return styles.join("");
          }} onClick={(e) => handleNav(e, 'libAlbums')} to={"/collection/albums"}>
            <button className='font-semibold text-white active:bg-brenk leading-4 text-[15px] tracking-wide'>
              Albums
            </button>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}