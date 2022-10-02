import { Button, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { useRouter } from 'next/router';

import type { ApiSongInfo } from '../../server/src/apiTypes/song';
import { StyledTableCell, StyledTableRow } from '../pages/song-management';

const SongTable = (props: { songs: ApiSongInfo[]; deleteSong: (id: string) => Promise<void> }) => {
  const router = useRouter();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Artist</StyledTableCell>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell>Duration</StyledTableCell>
            <StyledTableCell sx={{ width: 0 }}>
              <Button variant="contained" color="success" onClick={() => router.push('/create-song')}>
                Create
              </Button>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.songs.map((song) => (
            <StyledTableRow key={song.id}>
              <StyledTableCell>{song.id}</StyledTableCell>
              <StyledTableCell>{song.artist}</StyledTableCell>
              <StyledTableCell>{song.title}</StyledTableCell>
              <StyledTableCell>{`${Math.floor(song.length / 60)}:${
                song.length - Math.floor(song.length / 60) * 60
              }`}</StyledTableCell>
              <StyledTableCell sx={{ width: 0 }}>
                <Button variant="contained" color="error" onClick={() => props.deleteSong(song.id)}>
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
