import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfileMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/media/user-media`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedia(res.data.media);
      } catch (err) {
        console.error('Failed to load media:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  if (loading) return React.createElement('p', null, 'Loading media...');

  if (!media.length) return React.createElement('p', null, 'No media uploaded yet.');

  return React.createElement(
    'div',
    null,
    React.createElement('h3', null, 'Your Uploaded Media'),
    React.createElement(
      'div',
      { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } },
      media.map(function (item) {
        return React.createElement(
          'div',
          { key: item._id, style: { width: '150px' } },
          React.createElement('img', {
            src: item.url,
            alt: item.title,
            style: { width: '100%', height: 'auto', borderRadius: '8px' }
          }),
          React.createElement('p', { style: { fontSize: '0.9 + "rem"', marginTop: '5px' } }, item.title)
        );
      })
    )
  );
}

export default ProfileMedia;
