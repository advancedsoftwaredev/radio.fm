import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface PasswordUpdateProps {
  updatePass: (password: string) => Promise<void>;
  error: boolean;
  loading: boolean;
}

const PasswordUpdate = (props: PasswordUpdateProps) => {
  const [password, setNewPassword] = useState<string>('');
  const router = useRouter();

  return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
      <form>
        <Box display="flex" flexDirection="column" sx={{ width: '25rem' }}>
          <Typography variant="h4" sx={{ marginBottom: '.5rem' }}>
            Update Password
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: '.5rem' }}></Typography>
          <TextField
            variant="filled"
            placeholder="New Password"
            autoComplete="new-password"
            type="password"
            data-testid="testButton"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                backgroundColor: '#111',
                color: '#fff',
                padding: '1rem',
                borderRadius: '.3rem',
              },
            }}
          />
          <Box display="flex" sx={{ marginTop: '1rem' }}>
            <Button variant="outlined" sx={{ marginRight: '1rem' }} onClick={() => router.push('/account')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => props.updatePass(password)} data-testid="updateButton">
              {props.loading ? 'Update' : 'Update'}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default PasswordUpdate;
