import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
//import {Timeline} from "primereact/timeline";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

import { useSocketData, useSocketInterface } from '../components/hooks/socketContext';
import { useUserData } from '../components/hooks/userContext';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const ChatBox = () => {
  const [author, setAuthor] = useState<string>('');
  const [message, setMessage] = useState<string>('');

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

      {/* <div className='card'>
                <h3>Conversation</h3>
                <Timeline 
                value = {data?.messages} 
                opposite = {(item) => item.username}
                content = {(item) => (<small className = "p-text-secondary">
                    { data?.messages.map((mssg) => {
                        return <div>
                            <h4>{mssg.time}</h4>
                            <h2 style={{color: "white"}}>{mssg.msg}</h2>
                            </div>;
                    }) }
                    </small>)}
                />  */}

      <div className="card">
        <h3>Conversation</h3>
        <Timeline position="alternate">
          {data?.messages.map((mssg) => (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="secondary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div>
                  {/*<h4>{(mssg.time.getHours()) + ":" +  (mssg.time.getHours()) + ":" + (mssg.time.getSeconds())}</h4> */}
                  <h2 style={{ color: 'white' }}>{mssg.msg}</h2>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
};

export default ChatBox;
