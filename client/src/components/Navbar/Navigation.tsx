import React from 'react';
import { Icon } from '../Icons';
import { useNavigate } from 'react-router-dom'
import useHistoryStack from '../../utils/useHistoryStack';


export default function Navigation() {

  const navigate = useNavigate()
  const { stack: historyStack, canGoForward, setStack } = useHistoryStack();

  const navigateForward = () => {
    navigate(+1);
    // TODO: try and push to history stack
    if(!historyStack.includes(window.location.pathname)) {
      if(window.location.pathname !== '/') {
        setStack([...historyStack, window.location.pathname]);
      }
    }
  }


  return (
    <div>
      {historyStack.length > 0 && <button onClick={() => navigate(-1)} className='bg-brenk p-[6px] rounded-full items-center mr-3'>
        <Icon name="back" />
      </button>}
      {canGoForward && <button onClick={navigateForward} className='bg-brenk p-[6px] rounded-full items-center mr-2'>
        <Icon name="next" />
      </button>}
    </div>
  )
}
