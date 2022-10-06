import { Typography } from '@mui/material';

const ListenerCount = (props: { count: number }) => {
  return (
    <Typography sx={{ marginTop: '1rem' }}>
      {props.count > 1 ? (
        <>
          There are <strong>{props.count}</strong> people listening!
        </>
      ) : (
        <>
          There is <strong>{props.count}</strong> person listening!
        </>
      )}
    </Typography>
  );
};

export default ListenerCount;
