// npm install @mui/material
import * as React from "react";
import { AppBar, Toolbar, Typography, Button, Box} from "@mui/material"
// importing material UI components


const headerData = [
   {
    label: "Create Account",
    href:"",
   },
   {
    label: "Login",
    href:"",
   },
 ];

export default function Header() {
   const displayDesktop = () => {
    return <Toolbar >
        {FMLogo}
        {getMenuButtons()}
        </Toolbar>;
   };

   const FMLogo = (
    <Typography variant="h6" component="h1">
        Radio.FM - Music Anytime, Anywhere
    </Typography>
   );

   const getMenuButtons = () => {
    return headerData.map(({ label, href }) => {
      return (
        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
        <Button variant="contained" 
          {...{
            key: label,
            color: "secondary",
            to: href,
          }}
        >
          {label}
        </Button>
        </Box>
       );
     });
   };

   return(
    <header> 
        <AppBar style={{backgroundColor:'#3D4A81'}} >       
       {displayDesktop()}
        </AppBar>
    </header>
   );
}