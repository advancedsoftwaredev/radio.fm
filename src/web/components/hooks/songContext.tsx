import React, { useCallback, useContext, useEffect, useState } from 'react';

import type { ApiSongInfo } from '../../../server/src/apiTypes/song';
import type {
  CurrentSongData,
  LiveListenerData,
  SongInterruptData,
} from '../../../server/src/socketTypes/socketDataTypes';
import { api } from '../../util/api';
import { useUserData } from './userContext';

export type SongInfo = ApiSongInfo | null;

interface SongContextInterface {
  time: Number;
  song: SongInfo;
  nextSong: SongInfo;
  audio: HTMLAudioElement | null;
  volume: number;
  listenerCount: number;
  liked: boolean;
}

interface SongHandlerContextInterface {
  setListenerData: (data: LiveListenerData) => void;
  setSongData: (data: CurrentSongData) => void;
  setNextSongData: (data: ApiSongInfo) => void;
  setTimeData: (data: SongInterruptData) => void;
  setVolumeValue: (volumeValue: number) => void;
  getSongLiked: (songId: string) => Promise<void>;
}

export const SongContext = React.createContext<SongContextInterface | null>(null);
export const SongHandlerContext = React.createContext<SongHandlerContextInterface | null>(null);

export const useSong = () => useContext(SongContext);
export const useSongHandler = () => useContext(SongHandlerContext);

export const volumeKey = 'radiofm.volume';

export const SongContextProvider = (props: { children: any }) => {
  const [time, setTime] = useState<number>(0);
  const [song, setSong] = useState<SongInfo>(null);
  const [nextSong, setNextSong] = useState<SongInfo>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [nextAudio, setNextAudio] = useState<HTMLAudioElement | null>(null);
  const [listenerCount, setListenerCount] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);

  const [liked, setLiked] = useState<boolean>(false);

  const user = useUserData();

  useEffect(() => {
    void audio?.play();
    audio?.addEventListener('canplaythrough', () => audio.play());
  }, [song, audio]);

  useEffect(() => {
    console.log('nextSong', nextSong);
  }, [nextSong]);

  useEffect(() => {
    const savedVolume = Number(JSON.parse(JSON.stringify(localStorage.getItem(volumeKey))));
    if (savedVolume) {
      setVolume(() => savedVolume);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(volumeKey, JSON.stringify(volume));
    if (audio) {
      audio.volume = volume;
    }
  }, [audio, volume]);

  useEffect(() => {
    if (audio) {
      audio.currentTime = time;
      void audio.play();
    }

    return () => {
      audio?.pause();
      nextAudio?.pause();
    };
  }, [nextAudio, audio, time]);

  useEffect(() => {
    if (song && user?.role !== 'GUEST') {
      void getSongLiked(song.id);
    }
  }, [song, user]);

  const setListenerData = (data: LiveListenerData) => setListenerCount(data.liveListenerCount);

  const setSongData = useCallback(
    (data: CurrentSongData | null) => {
      if (!data) {
        return;
      }

      audio?.pause();
      nextAudio?.pause();

      if (!song || !nextSong || data.newQueue) {
        setSong(data.song);
        setAudio(new Audio(data.song.songMediaUrl));
      } else {
        if (data.finished) {
          const notUpdatedCorrectly = data.song.id !== nextSong.id;

          if (notUpdatedCorrectly) {
            setSong(data.song);
            setAudio(new Audio(data.song.songMediaUrl));
          } else {
            setSong(nextSong);
            setAudio(nextAudio);
          }
        }
      }

      setTime(data.time ?? 0);
    },
    [audio, nextAudio, song, nextSong]
  );

  const setNextSongData = (data: ApiSongInfo | null) => {
    if (!data) {
      return;
    }
    setNextSong(() => data);
    setNextAudio(new Audio(data.songMediaUrl));
  };

  const setTimeData = (data: SongInterruptData) => {
    if (!isNaN(data.time)) {
      setTime(data.time);
    }
  };

  const setVolumeValue = (volumeValue: number) => {
    setVolume(volumeValue);
  };

  const getSongLiked = async (songId: string) => {
    try {
      const liked = await api.user.likesSong({ songId });
      setLiked(liked.liked);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SongContext.Provider value={{ time, song, nextSong, audio, listenerCount, volume, liked }}>
      <SongHandlerContext.Provider
        value={{ setListenerData, setSongData, setNextSongData, setTimeData, setVolumeValue, getSongLiked }}
      >
        {props.children}
      </SongHandlerContext.Provider>
    </SongContext.Provider>
  );
};
