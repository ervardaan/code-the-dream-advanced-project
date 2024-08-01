const clientId = '0aabad6b6c8f4dbab7cb3d95174c0a16';
const clientSecret = '96be6ce90e5b4a8d822815e8ddba4531';
const playlistId = 'YOUR_PLAYLIST_ID';
const PlayListIds=[];
const getToken = async () => {
  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });
  const data = await result.json();
  return data.access_token;
};

const getPlaylists = async (token) => {
  const result = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });

  const data = await result.json();
  return data.playlists.items;
};

const getTracks = async (token, playlistId) => {
  const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });

  const data = await result.json();
  return data.items;
};

const displayPlaylists = async () => {
  const token = await getToken();
  const playlists = await getPlaylists(token);
  const content = document.getElementById('content');
  content.innerHTML = '';
  playlists.forEach(playlist => {
    PlayListIds.push(playlist.id);
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <img src="${playlist.images[0].url}" alt="${playlist.name}">
      <h3>${playlist.name}</h3>
    `;
    content.appendChild(div);
  });
};
const displayTracks = async () => {
  const token = await getToken();
  const playlists = await getPlaylists(token);
  playlists.forEach(playlist => {
  PlayListIds.push(playlist.id);
  });
//   the trick!
  const id=Math.floor(Math.random() * PlayListIds.length);
  const tracks = await getTracks(token,PlayListIds[id]);
  const content = document.getElementById('content');
  content.innerHTML = '';
  tracks.forEach(item => {
    const track = item.track;
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <img src="${track.album.images[0].url}" alt="${track.name}">
      <h3>${track.name}</h3>
      <p>${track.artists.map(artist => artist.name).join(', ')}</p>
    `;
    content.appendChild(div);
  });
};

if (window.location.pathname.includes('playlists.html')) {
  displayPlaylists();
}

if (window.location.pathname.includes('tracks.html')) {
  displayTracks();
}
