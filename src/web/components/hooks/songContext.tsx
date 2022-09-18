import React, { useContext, useEffect, useState } from 'react';
import { CurrentSongData, LiveListenerData, SongInterruptData } from '../../../server/src/socketTypes/socketDataTypes';
import { ApiSongInfo } from '../../apiTypes/song';

export type SongInfo = ApiSongInfo | null;

interface SongContextInterface {
  time: Number;
  song: SongInfo;
  nextSong: SongInfo;
  audio: HTMLAudioElement | null;
  volume: number;
  listenerCount: number;
}

interface SongHandlerContextInterface {
  setListenerData: (data: LiveListenerData) => void;
  setSongData: (data: CurrentSongData) => void;
  setNextSongData: (data: ApiSongInfo) => void;
  setTimeData: (data: SongInterruptData) => void;
  setVolumeValue: (volumeValue: number) => void;
}

const SongContext = React.createContext<SongContextInterface | null>(null);
const SongHandlerContext = React.createContext<SongHandlerContextInterface | null>(null);

export const useSong = () => useContext(SongContext);
export const useSongHandler = () => useContext(SongHandlerContext);

const volumeKey = 'radiofm.volume';

export const SongContextProvider = (props: { children: any }) => {
  const [time, setTime] = useState<number>(0);
  const [song, setSong] = useState<SongInfo>(null);
  const [nextSong, setNextSong] = useState<SongInfo>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [nextAudio, setNextAudio] = useState<HTMLAudioElement | null>(null);
  const [listenerCount, setListenerCount] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    setVolume(JSON.parse(localStorage.getItem(volumeKey) || '0.5'));
  }, []);

  useEffect(() => {
    if (audio) audio.volume = volume;
    localStorage.setItem(volumeKey, JSON.stringify(volume));
  }, [volume]);

  useEffect(() => {
    if (audio) {
      audio.currentTime = time;
      audio.play();
    }

    return () => {
      audio?.pause();
      nextAudio?.pause();
    };
  }, [audio, time]);

  const setListenerData = (data: LiveListenerData) => setListenerCount(data.liveListenerCount);

  const setSongData = (data: CurrentSongData) => {
    if (!data) {
      return;
    }

    audio?.pause();
    nextAudio?.pause();

    if (!song || !nextSong) {
      setSong(data.song);
      setAudio(new Audio(data.song.songMediaUrl));
    } else {
      if (data.finished) {
        setSong(nextSong);
        setAudio(nextAudio);
      }
    }

    setTime(data.time ?? 0);
  };

  const setNextSongData = (data: ApiSongInfo) => {
    setNextSong(data);
    setNextAudio(new Audio(data.songMediaUrl));
  };

  const setTimeData = (data: SongInterruptData) => {
    setTime(data.time);
  };

  const setVolumeValue = (volumeValue: number) => {
    setVolume(volumeValue);
  };

  return (
    <SongContext.Provider value={{ time, song, nextSong, audio, listenerCount, volume }}>
      <SongHandlerContext.Provider
        value={{ setListenerData, setSongData, setNextSongData, setTimeData, setVolumeValue }}
      >
        {props.children}
      </SongHandlerContext.Provider>
    </SongContext.Provider>
  );
};
