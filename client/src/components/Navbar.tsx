import React from 'react';
import Navigation from './Navbar/Navigation';
import User from './Navbar/User';
import { useMatch } from "react-router-dom";
import TopSearch from './Navbar/TopSearch';
import LibFilter from './Navbar/LibFilter';

interface Props {
  user: IUser,
}

export default function Navbar({ user }: Props) {

  const searchRoute = useMatch("/search");
  
  const libRoute = useMatch("/collection");;

  return (
    <nav className="h-[3.75rem] flex items-center justify-between px-8">

      <Navigation />
      {searchRoute && (<TopSearch />)}
      {libRoute && (<LibFilter />)}
      <User />
    </nav>
  )
}