import { Box, Button, TextField, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ApiSongInfo } from "../../../server/src/apiTypes/song"
import Header from "../../components/Header"
import { api } from "../../util/api"
import { inputStyle } from "../create-song"


const editsong = ()=> {
    const [albumImageUrl, setUrl] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router=useRouter()
    const {id}=router.query
    useEffect(()=> {
        const getSong = async () => {
            console.log(id)
            if (!id) {return}
            const response = await api.song.getById({id: Array.isArray(id) ? id[0] : id})
            console.log(response)
            if (response){
                setArtist(response.artist)
                setTitle(response.title)
                setDescription(response.description)
                setUrl(response.albumImageUrl)
            }
        }
        void getSong()

    },[id])

    const editSongHandler = async ()=> {
        let newUrl: string | null = null
        if (imageFile) {
            newUrl= (await api.songAdmin.uploadArt({title},imageFile)).albumImageUrl
        }
        await api.songAdmin.editSong({title,description,artist,id: (Array.isArray(id) ? id[0] : id)||"", albumImageUrl:!newUrl?albumImageUrl:newUrl})
        void router.push('/song-management')
    }

   
    return(
        <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '5rem',
        }}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Create Song</h1>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
              <TextField
                type="text"
                sx={inputStyle}
                variant="filled"
                label="Artist"
                placeholder="Artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                required={true}
              />
            </Box>
            <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
              <TextField
                type="text"
                sx={inputStyle}
                variant="filled"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required={true}
              />
            </Box>

            <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
              <TextField
                type="text"
                sx={inputStyle}
                variant="filled"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required={true}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" component="label" sx={{ alignSelf: 'start' }}>
                Upload Album Cover
                <input
                  id="album-cover-upload"
                  hidden={true}
                  accept="image/*"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
              </Button>
              {imageFile?.name && <Typography sx={{ marginLeft: '1rem' }}>{imageFile.name}</Typography>}
            </Box>            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '30rem' }}>
              <Button variant="outlined" onClick={() => router.push('/song-management')}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" onClick={()=>editSongHandler()}>
                {"Edit Song"}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </>
    ) 
}

export default editsong