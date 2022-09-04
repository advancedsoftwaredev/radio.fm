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

const Home: NextPage = () => {
  const socketHandler = useSocketInterface();

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

          <Typography variant="subtitle1">
            Now playing... <a>"SOS" - Avicii</a>
          </Typography>

          <div className={styles.card}>
            <Typography variant="subtitle2">
              SOS (Avicii song) " SOS " is the first posthumous single by Swedish DJ Avicii featuring co-production from
              Albin Nedler and Kristoffer Fogelmark, and vocals from American singer Aloe Blacc. It was released on 10
              April 2019 and is included on his posthumous third studio album Tim, released on 6 June 2019.
            </Typography>
          </div>
          <Button onClick={() => socketHandler?.getTime()}>
            <Box display="flex" alignItems="center">
              <Typography sx={{ fontSize: '2rem' }}>Play</Typography>
              <PlayArrowIcon sx={{ fontSize: '4rem' }} />
            </Box>
          </Button>
        </main>
      </Box>

      <VolumeSlider />
    </div>
  );
};

export default Home;
