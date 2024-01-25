import React, { useState, useEffect } from 'react';

const TrackComparisonGame = () => {
  const [tracks, setTracks] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const fetchRandomTracks = async () => {
      try {
        // Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your actual client ID and client secret
        const clientId = 'fe06704a7b964fe9aea22b83f3655c61';  // Replace with your actual client ID
        const clientSecret = '4de8a22d366a4cc9880cec6de6a955a4';  // Replace with your actual client secret

        // Get access token using client credentials flow
        const accessTokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
          body: 'grant_type=client_credentials',
        });

        if (!accessTokenResponse.ok) {
          throw new Error('Failed to obtain access token');
        }

        const { access_token: accessToken } = await accessTokenResponse.json();

        // Replace 'YOUR_PLAYLIST_ID' with your actual playlist ID
        const playlistId = '4MqwDHThCWLyvsZ2RRnTXE';

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=2`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch playlist tracks');
        }

        const data = await response.json();

        // Extract relevant data from the response
        const items = data.items.map(item => ({
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists.map(artist => artist.name),
        }));

        setTracks(items);
      } catch (error) {
        console.error('Error fetching tracks:', error.message);
      }
    };

    fetchRandomTracks();
  }, []);

  const handleTrackSelection = (selectedTrack) => {
    // Check if there is a winner
    if (tracks.length === 1) {
      setWinner(selectedTrack);
    } else {
      // Randomly select another track for comparison
      const remainingTracks = tracks.filter(track => track.id !== selectedTrack.id);
      const randomIndex = Math.floor(Math.random() * remainingTracks.length);
      const nextTrack = remainingTracks[randomIndex];
  
      // Update the tracks for the next round, including the selected track
      setTracks([selectedTrack, nextTrack]);
  
      setCurrentRound(currentRound + 1);
    }
  };
  
  

  const resetGame = () => {
    setCurrentRound(1);
    setWinner(null);
    // Re-fetch two random tracks for a new game
    fetchRandomTracks();
  };

  return (
    <div>
      <h1>Track Comparison Game</h1>

      {winner ? (
        <div>
          <h2>Winner: {winner.name} by {winner.artists.join(', ')}</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2>Round {currentRound}</h2>
          <div>
            {tracks.map((track) => (
              <div key={track.id}>
                {/* <img src={track.album.images[0].url} alt={track.name} /> */}
                {track && (
                  <p>
                    {track.name} by {track.artists.join(', ')}
                  </p>
                )}
                <button onClick={() => handleTrackSelection(track)}>Select</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackComparisonGame;

