/* eslint-disable @typescript-eslint/no-floating-promises */
import { Box } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import type { ApiUser } from '../../server/src/apiTypes/user';
import Header from '../components/Header';
import { useUserData, useUserInterface } from '../components/hooks/userContext';
import ParticlesComponent from '../components/Particles';
import PasswordUpdate from '../components/PasswordUpdate';
import VolumeSlider from '../components/VolumeSlider';
import { api } from '../util/api';

const ChangePassword = () => {
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

  const updatePassword = async (PasswordInput: string) => {
    setLoading(true);

    let newPass: ApiUser | undefined = undefined;

    if (PasswordInput) {
      newPass = await api.user.changePassword({ password: PasswordInput });
    }

    if (!newPass) {
      setError(true);
    } else {
      userhandler?.getSelf();
      router.push('/account');
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ height: '100vh' }}>
      <ParticlesComponent />
      <Head>
        <title>Now Listening to Radio.FM!</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <PasswordUpdate updatePass={updatePassword} error={error} loading={loading} />
      <VolumeSlider />
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <form>
          <Box display="flex" flexDirection="column" sx={{ width: '25rem' }}>
            <Typography variant="h4" sx={{ marginBottom: '.5rem' }}>
              Update Password
            </Typography>
            <TextField
              variant="filled"
              placeholder="New Password"
              autoComplete="new-password"
              type="password"
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  backgroundColor: '#111',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '.3rem',
                },
              }}
            />
            <Box display="flex" sx={{ marginTop: '1rem' }}>
              <Button variant="outlined" sx={{ marginRight: '1rem' }} onClick={() => router.push('/')}>
                Cancel
              </Button>
              <Button variant="contained" onClick={updatePassword}>
                {!loading ? 'Update' : 'Password Changed!'}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ChangePassword;
