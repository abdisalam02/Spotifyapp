// src/SpotifyApp.js
import React, { useEffect, useState } from 'react';

const SpotifyApp = () => {
  const [accessToken, setAccessToken] = useState('');
  const [playlistData, setPlaylistData] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [playbackState, setPlaybackState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const clientId = 'fe06704a7b964fe9aea22b83f3655c61';  // Replace with your actual client ID
      const clientSecret = '4de8a22d366a4cc9880cec6de6a955a4';  // Replace with your actual client secret

      const data = new URLSearchParams();
      data.append('grant_type', 'client_credentials');
      data.append('client_id', clientId);
      data.append('client_secret', clientSecret);

      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: data,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }

        const responseData = await response.json();
        const token = responseData.access_token;

        setAccessToken(token);  // Set the access token in the state
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []);  // Empty dependency array to run the effect only once

  const fetchPlaylistData = async (playlistId) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlist data');
      }

      const responseData = await response.json();
      setPlaylistData(responseData);

      // Fetch tracks data
      const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!tracksResponse.ok) {
        throw new Error('Failed to fetch playlist tracks');
      }

      const tracksData = await tracksResponse.json();
      setTracksData(tracksData);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const fetchPlaybackState = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playback state');
      }

      const playbackStateData = await response.json();
      setPlaybackState(playbackStateData);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    if (accessToken) {
      // Example: Fetching playlist data
      const playlistId = '4MqwDHThCWLyvsZ2RRnTXE';  // Replace with the actual Spotify ID of the playlist
      fetchPlaylistData(playlistId);
      fetchPlaybackState();  // Add this line to fetch playback state
    }
  }, [accessToken]);

  const playTrack = (trackUri) => {
    // Your playTrack function remains the same
  };

  const pausePlayback = () => {
    // Your pausePlayback function remains the same
  };

  return (
    <div>
      <h1>Spotify App</h1>
      {/* Your React App Content */}
      {playlistData && (
        <div>
          <img src={playlistData.images[0].url} alt="Playlist Cover" width="200" height="200" />
          <h2>{playlistData.name}</h2>
          <p>Owner: {playlistData.owner.display_name}</p>
          <p>Total Tracks: {playlistData.tracks.total}</p>
          {/* Add more details as needed */}
        </div>
      )}

      {playbackState && (
        <div>
          <h3>Playback State</h3>
          <p>Currently Playing: {playbackState.item.name} by {playbackState.item.artists.map(artist => artist.name).join(', ')}</p>
          <p>Progress: {playbackState.progress_ms} ms</p>
          <p>Is Playing: {playbackState.is_playing ? 'Yes' : 'No'}</p>
          {/* Add more details as needed */}
        </div>
      )}

      {tracksData && (
        <div>
          <h3>Tracks</h3>
          <ul>
            {tracksData.items.map(item => (
              <li key={item.track.id}>
                <strong>{item.track.name}</strong> by {item.track.artists.map(artist => artist.name).join(', ')}
                <p>Album: {item.track.album.name}</p>
                <p>Duration: {item.track.duration_ms} ms</p>
                <img src={item.track.album.images[0]?.url} alt="Album Cover" width="100" height="100" />
                <p>
                  Listen on Spotify:{' '}
                  <a href={item.track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    {item.track.name}
                  </a>
                  {' | '}
                  <button onClick={() => playTrack(item.track.uri)}>Play in App</button>
                  {' | '}
                  <button onClick={() => pausePlayback()}>Pause</button>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpotifyApp;
