import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import type { ApiSongInfo } from '../../server/src/apiTypes/song';
import { StyledTableCell, StyledTableRow } from '../pages/song-management';
import { useSong } from './hooks/songContext';

const SongTable = (props: {
  songs: ApiSongInfo[];
  deleteSong: (id: string) => Promise<void>;
  stopSong: () => any;
  audio: HTMLAudioElement[] | null;
}) => {
  const router = useRouter();
  const songData = useSong();

  useEffect(() => {
    return () => {
      props.stopSong();
      void songData?.audio?.play();
    };
  }, [props, songData?.audio]);

  useEffect(() => {
    props.audio?.forEach((audioElem) => (audioElem.volume = songData?.volume ?? 0.5));
  }, [songData?.volume, props.audio]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Artist</StyledTableCell>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell>Duration</StyledTableCell>
            <StyledTableCell sx={{ width: 0 }}></StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>
              <Button variant="contained" color="success" onClick={() => router.push('/create-song')}>
                Create
              </Button>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.songs.map((song, i) => (
            <StyledTableRow key={song.id}>
              <StyledTableCell data-testid="song-element">{song.id}</StyledTableCell>
              <StyledTableCell>{song.artist}</StyledTableCell>
              <StyledTableCell>{song.title}</StyledTableCell>
              <StyledTableCell>{`${Math.floor(song.length / 60)}:${
                song.length - Math.floor(song.length / 60) * 60
              }`}</StyledTableCell>
              <StyledTableCell sx={{ width: 0 }}>
                <PlayArrowIcon
                  sx={{ fontSize: '2rem', cursor: 'pointer' }}
                  onClick={async () => {
                    await props.stopSong();
                    if (props.audio) {
                      await props.audio[i].play();
                    }
                  }}
                />
              </StyledTableCell>
              <StyledTableCell sx={{ width: 0 }}>
                <Button variant="contained" onClick={() => router.push(`/edit-song/${song.id}`)}>
                  Edit
                </Button>
              </StyledTableCell>
              <StyledTableCell sx={{ width: 0 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => props.deleteSong(song.id)}
                  data-testid="delete-button"
                >
                  Delete
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SongTable;
