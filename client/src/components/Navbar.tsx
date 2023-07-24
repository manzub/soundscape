import React from 'react';
import Navigation from './Navbar/Navigation';
import User from './Navbar/User';
import { useMatch } from "react-router-dom";
import TopSearch from './Navbar/TopSearch';
import LibFilter from './Navbar/LibFilter';

interface Props {
  query: string, 
  setSearchQuery: Function,
}

export default function Navbar(props: Props) {

  const searchRoute = useMatch("/search");
  
  const libRoute = useMatch("/collection");;

  return (
    <nav className="h-[3.75rem] z-10 flex items-center justify-between px-8">

      <Navigation />
      {searchRoute && (<TopSearch query={props.query} setSearchQuery={props.setSearchQuery} />)}
      {libRoute && (<LibFilter />)}
      <User />
    </nav>
  )
}