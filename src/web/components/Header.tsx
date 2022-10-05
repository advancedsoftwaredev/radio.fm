import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { useUserData, useUserInterface } from './hooks/userContext';

const Header = () => {
  const user = useUserData();
  const userHandler = useUserInterface();
  const router = useRouter();

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" padding="1rem" position="absolute" width="100%">
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
          <Typography variant="h6" sx={{ marginRight: 'auto', marginLeft: '1rem' }}>
            {`Welcome, ${user.username}!`}
          </Typography>

          {user.role === 'ADMIN' && (
            <Button onClick={() => router.push('/song-management')}>
              <Typography variant="h6">Song Management</Typography>
            </Button>
          )}

          <Button onClick={() => userHandler?.logout()}>
            <Typography variant="h6">Logout</Typography>
          </Button>
        </>
      )}
    </Box>
  );
};

export default Header;

// const headerData = [
//   {
//     label: 'Create Account',
//     href: '',
//   },
//   {
//     label: 'Login',
//     href: '',
//   },
// ];

// export default function Header() {
//   const FMLogo = (
//     <Typography variant="h6" component="h1">
//       Radio.FM - Music Anytime, Anywhere
//     </Typography>
//   );

//   const getMenuButtons = () => {
//     return headerData.map(({ label, href }) => {
//       return (
//         <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
//           <Button
//             variant="contained"
//             {...{
//               key: label,
//               color: 'secondary',
//             }}
//           >
//             {label}
//           </Button>
//         </Box>
//       );
//     });
//   };

//   return (
//     <header>
//       <AppBar style={{ backgroundColor: 'none' }}>
//         <Toolbar>
//           {FMLogo}
//           {getMenuButtons()}
//         </Toolbar>
//       </AppBar>
//     </header>
//   );
// }
