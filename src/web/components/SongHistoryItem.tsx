import { Box, Typography } from '@mui/material';

import type { SongLogWithLike } from '../../server/src/apiTypes/song';
import { api } from '../util/api';
import { useSongHandler } from './hooks/songContext';
import { useUserData } from './hooks/userContext';
import LikeButton from './LikeButton';

const SongHistoryItem = (props: { songLog: SongLogWithLike; refresh: () => Promise<void> }) => {
  const user = useUserData();
  const startDate = new Date(props.songLog.startTime);
  const endDate = new Date(props.songLog.endTime);
  const songHandler = useSongHandler();

  const likeHandler = async () => {
    if (props.songLog.liked) {
      await api.user.unlikeSong({ songId: props.songLog.song.id });
    } else {
      await api.user.likeSong({ songId: props.songLog.song.id });
    }

    await props.refresh();
    await songHandler?.getSongLiked(props.songLog.songId);
  };

  const ensureTwoDigits = (str: string) => (str.length === 1 ? '0' + str : str);

  const dateString = () =>
    `${ensureTwoDigits(startDate.getDate().toString())}/${ensureTwoDigits(
      startDate.getMonth().toString()
    )}/${startDate.getFullYear()}`;

  const timeString = () =>
    `${ensureTwoDigits(startDate.getHours().toString())}:${ensureTwoDigits(
      startDate.getMinutes().toString()
    )}:${ensureTwoDigits(startDate.getSeconds().toString())}`;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: '#111',
        padding: '1.5rem',
        marginBottom: '1rem',
        borderRadius: '.5rem',
      }}
    >
      <Box sx={{ display: 'flex', marginBottom: '.5rem', alignItems: 'center' }}>
        <Typography sx={{ marginRight: '.5rem', fontSize: '.9rem', color: '#AAA' }}>{dateString()}</Typography>
        <Typography sx={{ color: '#CCC', fontSize: '.9rem', marginRight: 'auto' }}>{timeString()}</Typography>
        {user?.role !== 'GUEST' && (
          <Box sx={{ marginLeft: '.5rem' }}>
            <LikeButton liked={props.songLog.liked} likeHandler={() => likeHandler()} />
          </Box>
        )}
      </Box>
      <Typography sx={{ marginRight: 'auto', color: '#EEE' }}>{props.songLog.song.title}</Typography>
      <Typography sx={{ marginRight: 'auto', color: '#AAA', fontStyle: 'italic', marginBottom: '1rem' }}>
        {props.songLog.song.artist}
      </Typography>
      <Typography>{props.songLog.song.description}</Typography>
    </Box>
  );
};

export default SongHistoryItem;
