import { Box, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ApiUser } from '../apiTypes/user';
import { useUserData, useUserInterface } from '../components/hooks/userContext';
import {useSocketInterface, useSocketData} from '../components/hooks/socketContext'; 
import ParticlesComponent from '../components/Particles';
import {MessageData} from '../../server/src/socketTypes/socketDataTypes';

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"

import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
//import {Timeline} from "primereact/timeline"; 
import { Messages } from 'primereact';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

const ChatBox = () => {
    const[author, setAuthor] = useState<string>("");   
    const[message, setMessage] = useState<string>("");

    const addMessage = () => {
        const send = socketHandler?.sendMessage({time: new Date(), username: author, msg: message}); 
        setMessage(""); 
    }

    
    const user = useUserData();
    const data = useSocketData(); 
    const socketHandler = useSocketInterface();
    console.log(data?.messages)
    

    return (
        <div className="p-col-12">
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                </span>
                <InputText placeholder="Username" 
                value = {author}
                onChange = {(e) => setAuthor(e.target.value)}
                />
                <InputText 
                placeholder="Message" 
                value = {message}
                onChange = {(e) => setMessage(e.target.value)}
                />
                <Button onClick={() => addMessage()} label = "send"/>
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

                <div className='card'>
                <h3>Conversation</h3>
                <Timeline position="alternate">
                    
                </Timeline>
                
            </div>

        </div>
    )

}

export default ChatBox;  

