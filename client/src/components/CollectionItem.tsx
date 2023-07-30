import { ArrowRightIcon } from "@heroicons/react/24/solid"
import React, { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import musicPlaceholder from './images/music-placeholder.svg';
import { Playlist } from "spotify-types";

interface Props {
  item: any[],
  title: string,
  type: 'playlist' | 'song'
}

export default function CollectionItem(props: Props) {
  return (<div className='grid grid-cols-2 gap-x-4'>
    <div className='h-[296px] bg-gradient-to-r from-gra3 to-gra4 rounded p-6 group relative'>
      <div className='mt-20'>
        <br />
        <br />
        <br />
        <br />
      </div>
      <div>
        <h3 className='text-3xl font-bold mt-6'>{props.title}</h3>
        <p>{props.item.length} saved playlists</p>
      </div>
    </div>

    <div className='grid'>
      <div className='flex gap-x-4'>
        {props.item.map(item => (
          <Wrapper type={props.type} param={item}>
            <div className='relative '>
              <img className='w-auto h-44 inset-0 object-cover mb-4' src={item.images.length > 0 ? item.images[0].url : musicPlaceholder} alt="" />
              <button className='w-12 h-12 bg-primary absolute right-2 bottom-2 transition-opacity rounded-full flex items-center shadow-2xl justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100'>
                <ArrowRightIcon className='h-6 w-6' />
              </button>
            </div>
            <span className='font-semibold text-white text-[16px] whitespace-nowrap'>{item.name}</span> <br />
            <p className='font-thin font-sans capitalize'>{item.source} . {item.owner ? item.owner : item.dateAdded}</p>

          </Wrapper>
        ))}
      </div>
    </div>
  </div>)
}

type WrapperProps = {
  children: ReactNode,
  type: string,
  param: any
}

const Wrapper = ({ type, param, children }: WrapperProps) => {
  if (type === 'playlist') {
    const item: (Playlist | any) = param;
    return (<NavLink key={param} to={`/playlist/${item.source}/${item.id}`} className={'bg-footer rounded p-4 transition-all hover:bg-menubg group'}>
      {children}
    </NavLink>)
  }

  return (<div>{children}</div>)
}