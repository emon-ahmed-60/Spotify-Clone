import { createContext, useRef, useState, useEffect } from "react"
import { songsData } from "../assets/assets";
export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, settrack] = useState(songsData[0])
    const [playStatus, setplayStatus] = useState(false);
    const [time,settime] = useState({
        currentTime: {
            second : 0,
            minute: 0,
        },
        totalTime :{
            second : 0,
            minute: 0,
        }
    });

    const play = () => {
        audioRef.current.play();
        setplayStatus(true);
    }

    const pause = async () => {
       await audioRef.current.pause();
        setplayStatus(false);
    }

    const playWithId =async (id) => {
        await settrack(songsData[id]);
        await audioRef.current.play();
        setplayStatus(true);
    }

    const prev = async ()=> {
        if(track.id>0){
            await settrack(songsData[track.id-1]);
            await audioRef.current.play();
            setplayStatus(true);
        }
    }

    const next = async ()=> {
        if(track.id<songsData.length-1){
            await settrack(songsData[track.id+1]);
            await audioRef.current.play();
            setplayStatus(true);
        }
    }

    const seekSong = async (e)=> {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    }

    useEffect(() => {
      setTimeout(()=>{
        audioRef.current.ontimeupdate = () => {
            seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%"
            settime({
        currentTime: {
            second : Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
        },
        totalTime :{
            second : Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
        }
    })
        }
      },1000);
    }, [audioRef])
    

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        settrack,
        playStatus,
        setplayStatus,
        time,
        settime,
        play,
        pause,
        playWithId,
        prev,
        next,
        seekSong
    }

    return(
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;