import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

// Connect to Socket.io server
const socket = io.connect('http://localhost:5000');

const VideoCall = () => {
  const { chatId } = useParams();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [idToCall, setIdToCall] = useState("");

  const myVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      })
      .catch((err) => console.error("Error accessing media devices.", err));

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setName(data.name);
    });
  }, []);

  useEffect(() => {
    if (myVideoRef.current && stream) {
      myVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = remoteStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Convoflow Video Call</h1>

      <div style={styles.videoContainer}>
        {stream && (
          <video
            ref={myVideoRef}
            playsInline
            muted
            autoPlay
            style={styles.video}
          />
        )}
        {callAccepted && !callEnded && (
          <video
            ref={userVideoRef}
            playsInline
            autoPlay
            style={styles.video}
          />
        )}
      </div>

      <div style={styles.controlsContainer}>
        {receivingCall && !callAccepted ? (
          <div style={styles.incomingCall}>
            <h2 style={styles.text}>{name || "Someone"} is calling...</h2>
            <button onClick={answerCall} style={styles.answerButton}>Answer</button>
          </div>
        ) : null}

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            style={styles.input}
          />
          <button onClick={() => navigator.clipboard.writeText(me)} style={styles.button}>
            Copy Your ID
          </button>
          <input
            type="text"
            placeholder="ID to call"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
            style={styles.input}
          />
          <button onClick={() => callUser(idToCall)} style={styles.callButton}>Call</button>
        </div>

        {callAccepted && !callEnded ? (
          <button onClick={leaveCall} style={styles.endCallButton}>End Call</button>
        ) : null}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    color: 'white',
    backgroundColor: '#222',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    textAlign: 'center',
    color: '#61dafb',
    fontSize: '2rem',
  },
  videoContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: '20px',
  },
  video: {
    width: '45%',
    borderRadius: '12px',
    border: '2px solid #61dafb',
    backgroundColor: 'black',
  },
  controlsContainer: {
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    marginRight: '10px',
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    marginLeft: '10px',
    backgroundColor: '#61dafb',
    color: 'black',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#4db8db',
  },
  callButton: {
    padding: '10px 20px',
    backgroundColor: '#61dafb',
    color: 'black',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginLeft: '10px',
    transition: 'background-color 0.3s',
  },
  callButtonHover: {
    backgroundColor: '#4db8db',
  },
  endCallButton: {
    padding: '10px 20px',
    backgroundColor: '#ff4c4c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  endCallButtonHover: {
    backgroundColor: '#d44343',
  },
  answerButton: {
    padding: '10px 20px',
    backgroundColor: '#61dafb',
    color: 'black',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  answerButtonHover: {
    backgroundColor: '#4db8db',
  },
  incomingCall: {
    marginBottom: '20px',
  },
  text: {
    color: 'white',
    fontSize: '1.2rem',
    marginBottom: '10px',
  },
};

export default VideoCall;
