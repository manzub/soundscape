import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Playlist } from 'spotify-types';

interface SongProps {
  item: Playlist
}

export default function Song({ item }: SongProps) {
  return (
    <NavLink to={`/playlist/${item.id}`} className={'bg-footer rounded p-4 transition-all hover:bg-menubg group'}>
      <div className='relative '>
        <img className='w-auto h-auto inset-0 object-cover mb-4' alt='' src={item.images[0].url} />
        <button className='w-12 h-12 bg-primary absolute right-2 bottom-2 transition-opacity rounded-full flex items-center shadow-2xl justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100'>
          <ArrowRightIcon className='h-6 w-6' />
        </button>
      </div>
      <span className='font-semibold text-white text-[16px] whitespace-nowrap'>{item.name}</span> <br />
    </NavLink>
  )
}