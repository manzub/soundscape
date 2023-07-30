import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "@material-tailwind/react";
import hotHits2000 from '../components/images/hot-hits-image.jpeg';
import { ArrowRightIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import SpotifyHome from "../components/SpotifyHome";
import AppleMusicHome from "../components/appleMusicHome";

interface Props {
  user: IUser,
  setToastList: Function
}

export default function Home(props: Props) {
  const navigate = useNavigate();

  const [alerts, setAlert] = React.useState<Array<{ message: string, dismissable: boolean, action: Function }>>([]);


  useEffect(() => {
    if (!props.user.profile) {
      if (!alerts.find(x => x.message.includes('profile'))) {
        setAlert(f => ([...f, { message: 'create a profile to experience a personalised experience', dismissable: false, action: () => navigate('/profile') }]))
      }
    }
  }, [props.user.profile, alerts, navigate])

  const quickLinks = [
    {
      title: 'Featured Playlists',
      imageSrc: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
      linkTo: '#featuredDiv'
    },
    {
      title: '2000\'s Hot Hits',
      imageSrc: hotHits2000,
      linkTo: '#someDiv'
    },
    {
      title: 'Recently Added',
      imageSrc: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
      linkTo: '#someDiv'
    },
  ]

  return (
    <div>
      <div>
        <h3 className='text-3xl text-white font-bold tracking-tight mb-6'>Welcome!</h3>
        <div className="flex w-full flex-col gap-2">
          {alerts.map((item, idx) => (<React.Fragment key={idx}>
            <Alert className={`bg-[#F44335]/10 text-white border-l-4 border-[#F44335] rounded-none font-medium capitalize`}
              icon={<InformationCircleIcon className="mt-px h-6 w-6" />}
              action={<Button variant="text" color="white" size="sm" className="!absolute top-3 right-3" onClick={() => item.action()}>
                Get Started <ArrowRightIcon style={{ display: 'initial' }} className="mt-px h-6 w-6" />
              </Button>}>
              {item.message}
            </Alert>
          </React.Fragment>))}
        </div>
        <div className='mt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center justify-center gap-x-6 gap-y-4 mb-6 transition-all'>
          {quickLinks.map((item, idx) => (<div onClick={() => document.querySelector(item.linkTo)?.scrollIntoView({ behavior: 'smooth' })} key={idx} className='flex cursor-pointer items-center gap-x-4 bg-dortbox group relative hover:bg-dortboxact rounded'>
            <img className='w-[5rem] h-[5rem]' alt="someimage" src={item.imageSrc} />
            <h4 className='text-[16px] font-bold p-4'>{item.title}</h4>
            <button className='w-12 h-12 absolute right-2 transition-opacity rounded-full flex items-center shadow-2xl justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100'>
              <ArrowRightIcon className="h-6 w-6" />
            </button>
          </div>))}
        </div>
      </div>

      <SpotifyHome setToastList={props.setToastList} />
      <AppleMusicHome setToastList={props.setToastList} />
    </div>
  )
}