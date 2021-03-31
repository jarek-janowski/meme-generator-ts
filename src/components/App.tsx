import {useState, useEffect} from 'react'
import './App.css';

interface MemeProps {
  
}
 
const Meme: React.FC<MemeProps> = () => {

  const [memes, setMemes] = useState([] as any[])

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
    .then(res => res.json())
    .then(data => {
      const memes = data.data.memes
      setMemes(memes)
    })
  }, []);

  return ( 
    memes.length ? <img src={memes[0].url } alt={memes[0].name}/> : <></>
   );
}
 


const App = () => {
  return (
   <Meme />
  );
}

export default App;
