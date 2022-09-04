import { Box, Button, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" padding="1rem" position="absolute" width="100%">
      <Button variant="text" sx={{ marginRight: '.5rem' }}>
        <Typography variant="h6">Login</Typography>
      </Button>
      <Button variant="text">
        <Typography variant="h6">Register</Typography>
      </Button>
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
