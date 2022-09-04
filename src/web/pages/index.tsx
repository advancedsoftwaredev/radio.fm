import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';
import Header from '../components/Header';
import Particles from '../components/Particles';


const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Now Listening to Radio.FM!</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Particles/>
      <Header/>
      </header>
    

      <main className={styles.main}>
        <h1 className={styles.title}>You are listening to Radio.FM!</h1>
       
        <p className={styles.card1}>
          Now playing... <a>"SOS" - Avicii</a>
        </p>

        <div className={styles.card}>
          <a href="">
            SOS (Avicii song) " SOS " is the first posthumous single by Swedish DJ Avicii featuring co-production from
            Albin Nedler and Kristoffer Fogelmark, and vocals from American singer Aloe Blacc. It was released on 10
            April 2019 and is included on his posthumous third studio album Tim, released on 6 June 2019.
          </a>
        </div>
        
      </main>
    </div>
  );
};

export default Home;

