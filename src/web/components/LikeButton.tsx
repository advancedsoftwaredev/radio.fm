import { FavoriteBorderOutlined } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box } from '@mui/material';

const LikeButton = (props: { liked: boolean; likeHandler: (...args: any[]) => any }) => {
  return (
    <Box sx={{ marginLeft: '.75rem', cursor: 'pointer' }} onClick={props.likeHandler}>
      {props.liked ? <FavoriteIcon /> : <FavoriteBorderOutlined />}
    </Box>
  );
};

export default LikeButton;
