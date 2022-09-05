import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ApiUser } from '../apiTypes/user';
import { useUserData, useUserInterface } from '../components/hooks/userContext';
import LoadingButton from '@mui/lab/LoadingButton';
import ParticlesComponent from '../components/Particles';

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const user = useUserData();
  const userHandler = useUserInterface();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'GUEST') {
      router.push('/');
    }
  }, [user]);

  const handleLogin = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setLoading(true);

    let newUser: ApiUser | undefined = undefined;

    if (username && password) {
      newUser = await userHandler?.register(username, password);
    }

    if (!newUser) {
      setError(true);
    } else {
      setError(false);
    }

    setLoading(false);
  };

  return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
      <ParticlesComponent />
      <form>
        <Box display="flex" flexDirection="column" sx={{ width: '25rem' }}>
          <Typography variant="h4" sx={{ marginBottom: '.5rem' }}>
            Register
          </Typography>
          <TextField
            variant="filled"
            placeholder="Username"
            autoComplete="username"
            type="text"
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                backgroundColor: '#111',
                color: '#fff',
                padding: '1rem',
                borderRadius: '.3rem',
              },
              marginBottom: '1rem',
            }}
          />
          <TextField
            variant="filled"
            placeholder="Password"
            autoComplete="current-password"
            type="password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                backgroundColor: '#111',
                color: '#fff',
                padding: '1rem',
                borderRadius: '.3rem',
              },
            }}
          />
          {error && (
            <Typography sx={{ marginTop: '1rem' }} color="#FF0000">
              A user with that username already exists...
            </Typography>
          )}
          <Box display="flex" sx={{ marginTop: '1rem' }}>
            <Button variant="outlined" sx={{ marginRight: '1rem' }} onClick={() => router.push('/')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleLogin}>
              {!loading ? 'Register' : 'Loading...'}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default Register;
