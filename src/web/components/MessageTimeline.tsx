import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import type { IMessage } from './hooks/socketContext';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const MessageTimeline = (props: { messages: IMessage[] }) => {
  return (
    <div className="card">
      <h3>Conversation</h3>

      <Timeline position="alternate">
        {props.messages
          .slice()
          .reverse()
          .map((mssg) => (
            <TimelineItem key={mssg.id} data-testid="messageItem">
              <TimelineOppositeContent>
                <h4>{mssg.time.getHours() + ':' + mssg.time.getHours() + ':' + mssg.time.getSeconds()}</h4>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <h4 data-testid="messageItem_username" style={{ color: 'gold', fontFamily: 'serif' }}>
                  {mssg.username}
                </h4>
                <h2 data-testid="messageItem_mssg" style={{ color: 'white' }}>
                  {mssg.msg}
                </h2>
              </TimelineContent>
            </TimelineItem>
          ))}
      </Timeline>
    </div>
  );
};

export default MessageTimeline;
