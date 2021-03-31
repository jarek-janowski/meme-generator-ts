import {useState, useEffect} from 'react'
import './App.css';

interface MemeProps {
  
}
 
const Meme: React.FC<MemeProps> = () => {

  
  const [memes, setMemes] = useState([] as any[])
  const [memeIndex, setMemeIndex] = useState(0);
  

  // console.log(Math.floor(Math.random() * 100))

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
    .then(res => res.json())
    .then(data => {
      const memes = data.data.memes
      setMemes(memes)
      const randomMeme = Math.floor(Math.random() * memes.length)
      setMemeIndex(randomMeme)
    })
  }, []);

  return ( 
    memes.length
    ?<div className="memes">
      <button onClick={() => setMemeIndex(memeIndex + 1)}>Skip</button>
      <img style={{maxWidth: 500, maxHeight: 500}} src={memes[memeIndex].url } alt={memes[memeIndex].name}/> 
    </div>
    : <></>
   );
}
 


const App = () => {
  return (
    <div className="app">
      <Meme />
    </div>
  );
}

export default App;
