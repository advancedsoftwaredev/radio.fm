import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useUserData } from '../components/hooks/userContext';
import { api } from '../util/api';

const inputStyle = {
  '& .MuiInputBase-input': {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: '.3rem',
  },
  '.MuiFormLabel-root': {
    color: '#fff',
  },
};

const CreateSong = () => {
  const [artist, setArtist] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const user = useUserData();

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      void router.push('/');
    }
  }, [router, user]);

  const createSong = async () => {
    setLoading(true);
    if (imageFile && audioFile) {
      try {
        const imageResponse = await api.songAdmin.uploadArt({ title }, imageFile);
        try {
          if (imageResponse.albumImageUrl) {
            const audioResponse = await api.songAdmin.uploadSong(
              {
                title,
                artist,
                description,
                albumImageUrl: imageResponse.albumImageUrl,
              },
              audioFile
            );

            if (audioResponse.id) {
              void router.push('/song-management');
            }
          }
        } catch (e) {
          setError("Couldn't upload song, please try again");
        }
      } catch (e) {
        setError("Couldn't upload image, please try again");
      }
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Create Song</h1>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
            <TextField
              type="text"
              sx={inputStyle}
              variant="filled"
              label="Artist"
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required={true}
            />
          </Box>
          <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
            <TextField
              type="text"
              sx={inputStyle}
              variant="filled"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required={true}
            />
          </Box>

          <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
            <TextField
              type="text"
              sx={inputStyle}
              variant="filled"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={true}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="contained" component="label" sx={{ alignSelf: 'start' }}>
              Upload Album Cover
              <input
                id="album-cover-upload"
                hidden={true}
                accept="image/*"
                type="file"
                required={true}
                onChange={(e) => {
                  if (e.target.files) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
            </Button>
            {imageFile?.name && <Typography sx={{ marginLeft: '1rem' }}>{imageFile.name}</Typography>}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              component="label"
              sx={{ marginTop: '1rem', marginBottom: '1rem', alignSelf: 'start' }}
            >
              Upload Song MP3
              <input
                id="album-cover-upload"
                hidden={true}
                accept="audio/*"
                type="file"
                required={true}
                onChange={(e) => {
                  if (e.target.files) {
                    setAudioFile(e.target.files[0]);
                  }
                }}
              />
            </Button>
            {audioFile?.name && <Typography sx={{ marginLeft: '1rem' }}>{audioFile.name}</Typography>}
          </Box>
          {error && (
            <Box sx={{ marginBottom: '1rem' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '30rem' }}>
            <Button variant="outlined" onClick={() => router.push('/song-management')}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" onClick={() => createSong()}>
              {loading ? 'Loading...' : 'Create Song'}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default CreateSong;
