import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

import { useSocketData, useSocketInterface } from '../components/hooks/socketContext';
import { useUserData } from '../components/hooks/userContext';
import MessageTimeline from '../components/MessageTimeline';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const ChatBox = () => {
  const [author, setAuthor] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const router = useRouter();

  const addMessage = () => {
    const send = socketHandler?.sendMessage({ time: new Date(), username: author, msg: message });
    setMessage('');
  };

  const user = useUserData();
  const data = useSocketData();
  const socketHandler = useSocketInterface();
  console.log(data?.messages);

  return (
    <div className="p-col-12">
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
        </span>
        <InputText placeholder="Username" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <InputText placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={() => addMessage()} label="send" />
      </div>
      <MessageTimeline messages={data?.messages ?? []} />
      <Box sx={{ position: 'fixed', right: '1rem', bottom: '1rem' }}>
        <Button onClick={() => router.push('/')}>
          <Typography variant="h6">Home</Typography>
        </Button>
      </Box>
    </div>
  );
};

export default ChatBox;
