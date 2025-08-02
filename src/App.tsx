import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    try {
      const response = await fetch('https://moelqyursuwkgjdlncur.supabase.co/functions/v1/send-thought', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZWxxeXVyc3V3a2dqZGxuY3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMDEwNTUsImV4cCI6MjA2OTU3NzA1NX0.Ita0YuUxPtZpo8cTXpwm9TY81reJNW00qQI6k4adzUA'
        },
        body: JSON.stringify({
          content: message,
          sender_id: 1,
          recipient_id: 2
        })
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('Message sent!');
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('Request failed.');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Send a Thought</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleSend}>Send</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
