import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Carousel } from 'react-bootstrap';

function App() {
  const [topAlbums, setTopAlbums] = useState([]);
  const [newAlbums, setNewAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('ALL');

  useEffect(() => {
    // Fetch Top Albums
    axios.get('https://qtify-backend-labs.crio.do/albums/top')
      .then(response => {
        setTopAlbums(response.data);
      })
      .catch(error => {
        console.error('Error fetching top albums:', error);
      });

    // Fetch New Albums
    axios.get('https://qtify-backend-labs.crio.do/albums/new')
      .then(response => {
        setNewAlbums(response.data);
      })
      .catch(error => {
        console.error('Error fetching new albums:', error);
      });

    // Fetch Songs
    axios.get('https://qtify-backend-labs.crio.do/songs')
      .then(response => {
        setSongs(response.data);
        setFilteredSongs(response.data);
      })
      .catch(error => {
        console.error('Error fetching songs:', error);
      });
  }, []);

  const filterSongsByGenre = (genre) => {
    setSelectedGenre(genre);
    if (genre === 'ALL') {
      setFilteredSongs(songs);
    } else {
      setFilteredSongs(songs.filter(song => song.genre.toUpperCase() === genre));
    }
  };

  const renderAlbumCards = (albums) => {
    return albums.map((album, index) => (
      <div key={index} className="card mx-2" style={{ width: '160px', height: '285px', backgroundColor: 'black', borderRadius: '10px', overflow: 'hidden' }}>
        <div className="position-relative">
          <img src={album.image} className="card-img-top" alt={album.title} style={{ height: '200px', width: '160px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} />
          <div className="position-absolute w-100" style={{ bottom: '0', backgroundColor: 'rgb(52, 201, 75)', height: '40px', display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
            <div className="d-flex align-items-center" style={{ backgroundColor: 'black', padding: '2px 10px', borderRadius: '20px' }}>
              <span className="text-white" style={{ fontSize: '0.8rem' }}>{album.follows || album.likes} {album.follows ? 'Follows' : 'Likes'}</span>
            </div>
          </div>
        </div>
        <div className="card-body text-center" style={{ backgroundColor: 'black' }}>
          <p className="card-title mb-0 text-white" style={{ textAlign: 'left', fontSize: '0.90rem', fontWeight: '500' }}>{album.title}</p>
        </div>
      </div>
    ));
  };

  const renderCarouselItems = (albums) => {
    const items = [];
    for (let i = 0; i < albums.length; i += 10) {
      items.push(
        <Carousel.Item key={i}>
          <div className="d-flex justify-content-center">
            {renderAlbumCards(albums.slice(i, i + 10))}
          </div>
        </Carousel.Item>
      );
    }
    return items;
  };

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: 'black' }}>
      <header className="d-flex align-items-center justify-content-between px-5 py-3 w-100" style={{height: '83px', backgroundColor: 'rgb(52, 201, 75)' }}>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAkCAYAAADSO4eRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ/SURBVHgB5VnhedowED2c/i9NBsCZoDBBnAlCJ4g7QekEkAmaTICZIM0EOBNAJkATBBZI3HdwIoeQwRhIoHnfd0jySSf7dHc6iQoVQBU4OTmJsiy74CbKUFiTSqXyBBq+vLykE4COGJVVTOigHgTBNaoxN2k9ktfX1xvoxNARwqsMtgQooY1qy8OeCDFC8uP2+fn5Nx0ZlpQBPYRQRJ/Uh8ItUtADqn/dVWfrQVGHq7RBoWIZWMnlMVnJgjJcRUABBvQTH5RSAWB87CjlqBQyV4bHInr4kNamQZHlQBl/QE15xAppHFVwPT097YIyoYS2BMtQ8rp0BJhaBlYzEquYusZ4PD6nLcFBGNYxsC4j7pLSASPgH+QQbfsAyrikHYDdguONbXMsoQNHwD6Ol46knewy2LElQAkp11FGbIF0wIB3BLFtwJR7tGMgM71Rk0V0wAiwYhdSn+zJp4ckSRossE57BuaIQV2hcJOxX+wADpxnZ2csKISFcHI1zJlsmmRJ01g3cCFBOQKfcxVWBgfU77QF5F1jUMJyPfyu8C3Y0g0Vhdr+XGq5LwLqZ8sYuSuAse08ubQFZC7G2MNrqncag+43tYxgBU/vMCEK3nojTz/mDRwXiKkEWIaYOVPV4VXpLSGsunzn3RqwnB8+61mFVcrQk7XVi7DJc1Dkg5hRfe9V/5DKgbPWrtBXzcCH2XkNzy1tDeuCk02VYPFlXQflpxYNOxl4CYoBzT6e3YjPJgntCZDdQdFZ06102h8U6BOr+kLgktW5U/xrKgnJdWrqUYOfaXcQN4pUXjR1H2nrfvM+vjG58lYE0EwG9FVg8gms6sBVRGaOMvIQqT4jG7SdD/dhJPxb9azuzDmW59OjSBHL0AKWtluxDiNNVkyNysHQookbKrYtTjz99NhUPY9sRRRjrYnvagopY25+nqClJ7f4RiUA2Xw41C7HOcp5Xh6jxg1lrO1nZJw9Y+nxOs9ZWmRWhqHdIveuFKsxpHeGLGAqzaZizTNvq3BWxq7PI/qOdAFQxh19DB6k1G5sLePRdgpwcdshv0Lsixv7YEU8mJscm22OvB5S/IQ+BqmqX8oOVXd50zwDColxluDj9hXOE6y9R1ESgz8utIJAiZ5F8pCqFoyxLcgzuCe5Ap+v/XofebHDC5TJ+YhmSjCKnVJRQEhLbU19D/+X4se0BTC+o2TVPPyRu7UqXj+PJ3y7xY7UNy30LbKbJPQWA3hPv1YThPT234rZZ/a5A6RShqAr59kUa5XhyTKTbHYi5PODTcUZPVnZDpWHUfWIdovUI/uRygAfmWQFQSWR+bPJmuKPyrqJ08ci1PwibjIFLCRGwRe8e8sVZL93t99SSVwOHlR9WPZ0+64QC2Ha6TWhY3lH8V/O3pAtHtqa9JmhYg6jSp8N2ezOog8afHoX8exQoyznonjttd9/glTKJ9Bt3i7yDwI32xLUo15uAAAAAElFTkSuQmCC" alt="Logo" />
        <div className="input-group w-50 ">
          <input type="text" className="form-control" placeholder="Search an album of your choice" />
          <span className="input-group-text" style={{height: '40px', width: '50px', justifyContent: 'center' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
        <button className="btn" style={{ backgroundColor: 'rgb(18, 18, 18)', color: 'rgb(52, 201, 75)' }}>Feedback</button>
      </header>

      <section className="d-flex align-items-center justify-content-center mb-5" style={{ height: '253px', width: '100%', backgroundColor: 'black' }}>
        <div className="d-flex align-items-center justify-content-between w-75">
          <div className="text-white" style={{ textAlign: 'center', marginLeft: '300px', fontSize: '2rem', fontWeight: 'bolder'}}>
            <h1>100 Thousand Songs, ad free</h1>
            <h1>Over thousands podcast episodes</h1>
          </div>
          <img src="https://qtify-venkykumar.netlify.app/static/media/headphone.66e109c97f55e2a35a02d810fa2b6650.svg" alt="Headphone" style={{ height: '200px', marginRight: '300px'}} />
        </div>
      </section>

      <section className="mb-5 px-5">
        <h3 className="mb-3 d-flex justify-content-between align-items-center text-white" style={{ textAlign: 'left', marginLeft: '45px', fontSize: '1.1rem', fontWeight: '900'}}>
          Top Albums
          <span className="text-success" style={{ cursor: 'pointer', textAlign: 'right', marginRight: '45px'}}>Show all</span>
        </h3>
        
        <Carousel indicators={false} controls={true} interval={null} className="carousel-dark">
          {renderCarouselItems(topAlbums)}
        </Carousel>
        
      </section>

      <section className="mb-5 px-5">
        <h3 className="mb-3 d-flex justify-content-between align-items-center text-white" style={{ textAlign: 'left', marginLeft: '45px', fontSize: '1.1rem', fontWeight: '900'}}>
          New Albums
          <span className="text-success" style={{ cursor: 'pointer', textAlign: 'right', marginRight: '45px'}}>Show all</span>
        </h3>
        
        <Carousel indicators={false} controls={true} interval={null} className="carousel-dark">
          {renderCarouselItems(newAlbums)}
        </Carousel>
        
      </section>

      <section className="mb-5 px-5">
        <hr style={{ borderTop: '5px solid rgb(52, 201, 75)' }} />
        <br />
        <h3 className="mb-3 d-flex justify-content-between align-items-center text-white" style={{ textAlign: 'left', marginLeft: '45px', fontSize: '1.1rem', fontWeight: '900'}}>
          Songs
          <span className="text-success" style={{ cursor: 'pointer', textAlign: 'right', marginRight: '45px'}}>Show all</span>
        </h3>
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group" aria-label="Basic outlined example">
            {['ALL', 'ROCK', 'POP', 'JAZZ', 'BLUES'].map((genre) => (
              <button
                key={genre}
                type="button"
                className={`btn ${selectedGenre === genre ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => filterSongsByGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        <Carousel indicators={false} controls={true} interval={null} className="carousel-dark">
          {renderCarouselItems(filteredSongs)}
        </Carousel>
        <hr style={{ borderTop: '5px solid rgb(52, 201, 75)' }} />
      </section>

      


      <footer className="d-flex justify-content-between align-items-center px-5 py-4" style={{ backgroundColor: 'rgb(52, 201, 75)' }}>
        <div className="text-white">
          <h5>Qtify</h5>
          <p>Qtify is a digital music service that gives you access to millions of songs and other content from creators all over the world.</p>
        </div>
        <div className="text-white">
          <h5>Contact</h5>
          <p>Bengaluru, India<br />
          qtify@gmail.com<br />
          +91 778987457425<br />
          02145-54214525</p>
        </div>
      </footer>
    </div>
  );
}

export default App;