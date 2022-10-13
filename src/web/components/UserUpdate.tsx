import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface UserUpdateProps {
  updateUser: (username: string) => Promise<void>;
  error: boolean;
  loading: boolean;
}

const UserUpdate = (props: UserUpdateProps) => {
  const [username, setNewUsername] = useState<string>('');
  const router = useRouter();

  return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
      <form>
        <Box display="flex" flexDirection="column" sx={{ width: '25rem' }}>
          <Typography variant="h4" sx={{ marginBottom: '.5rem' }}>
            Update Username
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: '.5rem' }}></Typography>
          <TextField
            variant="filled"
            placeholder="New Username"
            autoComplete="new-username"
            type="username"
            data-testid="testButton"
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewUsername(event.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                backgroundColor: '#111',
                color: '#fff',
                padding: '1rem',
                borderRadius: '.3rem',
              },
            }}
          />
          {props.error && (
            <Typography sx={{ marginTop: '1rem' }} color="#FF0000">
              A user with that username already exists...
            </Typography>
          )}
          <Box display="flex" sx={{ marginTop: '1rem' }}>
            <Button variant="outlined" sx={{ marginRight: '1rem' }} onClick={() => router.push('/account')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => props.updateUser(username)} data-testid="updateButton">
              {props.loading ? 'Update' : 'Update'}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default UserUpdate;
