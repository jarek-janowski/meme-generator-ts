import { useState, useEffect } from 'react';
import { useHistory, useLocation, Switch, Route } from 'react-router-dom';
import { useClipboard } from 'use-clipboard-copy'
import './App.css';

const Meme = () => {

  const [memes, setMemes] = useState([] as any[])
  const [memeIndex, setMemeIndex] = useState(0);
  const [captions, setCaptions] = useState([] as any)

  const history = useHistory();
 
 
  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
    .then(res => res.json())
    .then(data => {
      const memes = data.data.memes
      setMemes(memes)
      const randomMemeIndex = Math.floor(Math.random() * memes.length)
      setMemeIndex(randomMemeIndex)
    })
  }, []);

  useEffect(() => {
    if(memes.length) {
      setCaptions(Array(memes[memeIndex].box_count).fill(''));
    }
  }, [memeIndex, memes]);

  

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
    console.log('formData', formData);
    formData.append('username', 'qwerty935');

    formData.append('password', 'qwerty123');
    formData.append('template_id', currentMeme.id);
    captions.forEach((caption: string, index: number) => formData.append(`boxes[${index}][text]`, caption))

    fetch('https://api.imgflip.com/caption_image', {
      method: 'POST',
      body: formData
    })
    .then(res => {
      res.json().then(data => {
      history.push(`/generated?url=${data.data.url}`);
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

const MemeGenerated = () => {

  const [copied, setCopied] = useState(false);

  const clipboard = useClipboard();
  const history = useHistory();
  const location = useLocation();
  const url = new URLSearchParams(location.search).get('url')

  const copyLink = () => {
    clipboard.copy(url);
    setCopied(true);

  }

  return(
    <div>
      <button onClick={()=> history.push('/')}>
        Do another meme!
      </button>
      { url && <img style={{maxWidth: 500, maxHeight: 500}} src={url} alt="generated meme"/>}
      <button onClick={copyLink}>
        {copied ? 'Link copied!' : 'Copy link'}
      </button>
    </div>
  )
}


const App = () => {
  return (
    <div className="app">
      <h1>Meme Creator</h1>
      <Switch>
        <Route exact path='/'>
          <Meme />
        </Route>
        <Route path='/generated'>
          <MemeGenerated />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
