import React from 'react';
import {Icon} from '../Icons';


export default function DownloadApp() {
  return (
      <div>
          <a className='flex gap-x-4 py-2 text-link hover:text-white transition-colors items-center' href="#s">
          <span><Icon name="menudownload" /></span>
          <span className='text-sm font-bold'>Download App</span>
          </a>
      </div>
  )
}
