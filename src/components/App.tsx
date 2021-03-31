import {useState, useEffect} from 'react'
import './App.css';

const Meme = () => {
  

  const [memes, setMemes] = useState([] as any[])
  const [memeIndex, setMemeIndex] = useState(0);
  const [captions, setCaptions] = useState([] as any)
 
  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
    .then(res => res.json())
    .then(data => {
      const memes = data.data.memes
      setMemes(memes)
      console.log(memes)
      const randomMemeIndex = Math.floor(Math.random() * memes.length)
      setMemeIndex(randomMemeIndex)
    })
  }, []);

  useEffect(() => {
    if(memes.length) {
      setCaptions(Array(memes[memeIndex].box_count).fill(''));
    }
  }, [memeIndex, memes]);

  useEffect(() => {
    console.log(captions)
  }, [captions]);

  const updateCaption = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const text = e.target.value || '';
    setCaptions(
      captions.map((caption: string, i: number) =>{
        if(index === i){
          return text
        }else {
          return caption
        }
      })
    )
  }

  const generateMeme = () => {
    const currentMeme = memes[memeIndex];
    const formData = new FormData();

    formData.append('username', 'qwerty935');
    formData.append('password', 'qwerty123');
    formData.append('template_id', currentMeme.id);
    captions.forEach((caption: string, index: number) => formData.append(`boxes[${index}][text]`, caption))
    fetch('https://api.imgflip.com/caption_image', {
      method: 'POST',
      body: formData
    })
    .then(res => {res.json()
    .then(data => {
      console.log(data);
    })
    })
  }

  return ( 
    memes.length
    ?<div className="memes">
      <button onClick={generateMeme}>Generate</button>
      <button onClick={() => setMemeIndex(memeIndex + 1)}>Skip</button>
      {
        captions.map((caption: string, index: number) =>(
          <input onChange={(e) => updateCaption(e, index)} key={index}/>
        ))
      }
      <img 
        style={{maxWidth: 500, maxHeight: 500}} 
        src={memes[memeIndex].url } 
        alt={memes[memeIndex].name}
      /> 
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
