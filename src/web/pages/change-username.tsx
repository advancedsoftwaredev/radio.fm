/* eslint-disable @typescript-eslint/no-floating-promises */
import { Box, Button, TextField, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import type { ApiUser } from '../../server/src/apiTypes/user';
import { useUserData, useUserInterface } from '../components/hooks/userContext';
import { api } from '../util/api';

const ChangeUsername = () => {
  const [username, setNewUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const user = useUserData();
  const userhandler = useUserInterface();
  const router = useRouter();

  useEffect(() => {
    if (user?.role == 'GUEST') {
      void router.push('/');
    }
  }, [user, router]);

  const updateUsername = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setLoading(true);

    let newUsername: ApiUser | undefined = undefined;

    if (username) {
      newUsername = await api.user.changeUsername({ username });
    }

    if (!newUsername) {
      setError(true);
    } else {
      userhandler?.getSelf();
      router.push('/account');
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ height: '100vh' }}>
      <Head>
        <title>Now Listening to Radio.FM!</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <form>
          <Box display="flex" flexDirection="column" sx={{ width: '25rem' }}>
            <Typography variant="h4" sx={{ marginBottom: '.5rem' }}>
              Update Username
            </Typography>
            <TextField
              variant="filled"
              placeholder="New Username"
              autoComplete="new-username"
              type="username"
              value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewUsername(event.target.value)}
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
              <Button variant="contained" onClick={updateUsername}>
                {loading ? 'Update' : 'Update'}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ChangeUsername;
