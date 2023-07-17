import React from "react"
import { NavLink } from 'react-router-dom';
import { Icon } from '../Icons';
import { people, peopleOutline } from 'ionicons/icons';
import { IonIcon } from "@ionic/react";

export default function Menu() {

  let navlinkstyle = "h-10 flex items-center text-sm font-bold text-link hover:text-white px-4 gap-4 transition-colors";

  return (
    <div id='tummenu'>
      <nav className="px-2">

        <ul className="flex flex-col">
          <li>

            <NavLink to={"/"} className={({isActive}) => {
              let styles = [navlinkstyle];
              if (isActive) styles.push("!text-white")
              return styles.join("");
            }}>
              {window.location.href === 'http://localhost:3000/' ? <Icon name="acthome" /> : <Icon name="home" />}
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to={"/search"} className={({isActive}) => {
              let styles = [navlinkstyle];
              if (isActive) styles.push("!text-white")
              return styles.join("");
            }}>
              {window.location.href === 'http://localhost:3000/search' ? <Icon name="actsearch" /> : <Icon name="search" />}

              Search
            </NavLink>
          </li>
          <li>
            <NavLink to={"/social"} className={({isActive}) => {
              let styles = [navlinkstyle];
              if (isActive) styles.push("!text-white")
              return styles.join("");
            }}>
              {window.location.href === 'http://localhost:3000/social' ? <IonIcon icon={people} size="large" /> : <IonIcon icon={peopleOutline} size="large" />}
              Social
            </NavLink>
          </li>
          <li>
            <NavLink to={"/collection"} className={({isActive}) => {
              let styles = [navlinkstyle];
              if (isActive) styles.push("!text-white")
              return styles.join("");
            }}>
              {window.location.href === 'http://localhost:3000/collection' ? <Icon name="actcollection" /> : <Icon name="lib" />}

              Library
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}