import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import type { ApiUser } from '../../server/src/apiTypes/user';
import Header from '../components/Header';
import { useUserData, useUserInterface } from '../components/hooks/userContext';

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
      void router.push('/');
    }
  }, [user, router]);

  const handleLogin = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setLoading(true);

    let newUser: ApiUser | undefined = undefined;

    if (username && password) {
      newUser = await userHandler?.login(username, password);
    }

    if (!newUser) {
      setError(true);
    } else {
      setError(false);
    }

    setLoading(false);
  };

  return (
    <>
      <Header />

      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <form>
          <Box display="flex" flexDirection="column" sx={{ width: '25rem' }}>
            <Typography variant="h4" sx={{ marginBottom: '.5rem' }}>
              Login
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
              type="password"
              autoComplete="current-password"
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
                Invalid login credentials...
              </Typography>
            )}
            <Box display="flex" sx={{ marginTop: '1rem' }}>
              <Button variant="outlined" sx={{ marginRight: '1rem' }} onClick={() => router.push('/')}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleLogin}>
                {!loading ? 'Login' : 'Loading...'}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default Register;
