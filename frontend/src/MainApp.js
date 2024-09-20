import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "./GlobalStyles.css";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import VideoCall from "./Pages/VideoCall"; // Import VideoCall component

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/chats" component={ChatPage} />
          <Route path="/video-call/:chatId" component={VideoCall} /> {/* Ensure correct path */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
