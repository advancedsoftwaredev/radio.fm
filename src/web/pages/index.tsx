import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';
import Header from '../components/Header';
import Particles from '../components/Particles';
import { Box, Button, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useSocketData, useSocketInterface } from '../components/hooks/socketContext';
import VolumeSlider from '../components/VolumeSlider';
import { useSong } from '../components/hooks/songContext';
import { ApiSongInfo } from '../apiTypes/song';

const Home: NextPage = () => {
  const socketHandler = useSocketInterface();
  const song = useSong();

  const getSongCaption = (songData: ApiSongInfo) => `"${songData?.title}" - ${songData?.artist}`;

  return (
    <div className={styles.container}>
      <Particles />
      <Head>
        <title>Now Listening to Radio.FM!</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Box display="flex" sx={{ flexDirection: 'column', height: '100vh' }}>
        <main className={styles.main}>
          <h1 className={styles.title}>You are listening to Radio.FM!</h1>

          {song?.song && (
            <>
              {song.song.albumImageUrl && (
                <img
                  src={song?.song?.albumImageUrl}
                  alt="Song album cover"
                  style={{ width: '15rem', marginBottom: '1rem' }}
                />
              )}

              <Typography variant="h5" fontWeight="bold">
                {getSongCaption(song.song)}
              </Typography>

              <Box sx={{ border: '0px solid white', maxWidth: '30rem', marginTop: '1rem', textAlign: 'center' }}>
                <Typography variant="subtitle1">{song?.song?.description}</Typography>
              </Box>

              <Button onClick={() => socketHandler?.getTime()}>
                <Box display="flex" alignItems="center">
                  <Typography sx={{ fontSize: '2rem' }}>Play</Typography>
                  <PlayArrowIcon sx={{ fontSize: '4rem' }} />
                </Box>
              </Button>
            </>
          )}

          {song?.nextSong && (
            <>
              <Typography sx={{ fontWeight: 'bold', marginTop: '1rem' }}>Up Next...</Typography>
              <Typography variant="subtitle2">{getSongCaption(song?.nextSong)}</Typography>
            </>
          )}
        </main>
      </Box>

      <VolumeSlider />
    </div>
  );
};

export default Home;
