import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';

import type { ApiSongInfo } from '../../server/src/apiTypes/song';
import { useSongHandler } from '../components/hooks/songContext';
import { api } from '../util/api';

const LikedSongs = (props: { songs: ApiSongInfo[]; refresh: () => any }) => {
  const songHandler = useSongHandler();

  const unlikeHandler = async (songId: string | null) => {
    if (!songId) {
      return;
    }

    await api.user.unlikeSong({ songId });
    props.refresh();
    void songHandler?.getSongLiked(songId);
  };

  return (
    <Box display="flex">
      {props.songs.map((song) => (
        <Card key={song.id} sx={{ display: 'inline-block', marginRight: '2rem', maxWidth: 345 }}>
          {song.albumImageUrl && (
            <img src={song.albumImageUrl} alt="Song album cover" style={{ width: '21.58rem', marginBottom: '1rem' }} />
          )}
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {song.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={() => unlikeHandler(song.id)} size="small">
              Remove from favourites
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default LikedSongs;
