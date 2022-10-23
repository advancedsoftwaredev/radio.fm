import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useUserData, useUserInterface } from './hooks/userContext';

const Header = () => {
  const user = useUserData();
  const userHandler = useUserInterface();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" padding="1rem" width="100%">
      <Button
        variant="text"
        sx={{ marginRight: '1rem', order: user && user.role === 'GUEST' ? '0' : '1' }}
        onClick={() => router.push('/song-history')}
      >
        <Typography variant="h6">Previously Played</Typography>
      </Button>
      {!user || user.role === 'GUEST' ? (
        <>
          <Button variant="text" sx={{ marginRight: '.5rem' }} onClick={() => router.push('/login')}>
            <Typography variant="h6">Login</Typography>
          </Button>
          <Button variant="text" onClick={() => router.push('/register')}>
            <Typography variant="h6">Register</Typography>
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6" sx={{ marginRight: 'auto', marginLeft: '1rem', order: '0' }}>
            {`Welcome, ${user.username}!`}
          </Typography>

          <Button variant="text" sx={{ marginRight: '1rem', order: '2' }} onClick={() => router.push('/')}>
            <Typography variant="h6">Home</Typography>
          </Button>

          <Button variant="text" sx={{ marginRight: '1rem', order: '3' }} onClick={() => router.push('/liked-songs')}>
            <Typography variant="h6">Favourites</Typography>
          </Button>

          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            variant="contained"
            sx={{ order: '4' }}
          >
            <Typography variant="h6">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {' '}
                Settings{' '}
                <ArrowForwardIosIcon
                  fontSize="small"
                  sx={{ marginLeft: '.5rem', transform: open ? 'rotateZ(90deg)' : '' }}
                />
              </Box>
            </Typography>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => {
                void router.push('/account');
                handleClose();
              }}
            >
              View Account
            </MenuItem>
            {user.role === 'ADMIN' && <Divider />}
            {user.role === 'ADMIN' && (
              <MenuItem
                onClick={() => {
                  void router.push('/song-management');
                  handleClose();
                }}
              >
                Song Management
              </MenuItem>
            )}
            <Divider />
            <MenuItem
              onClick={() => {
                userHandler?.logout();
                handleClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default Header;
