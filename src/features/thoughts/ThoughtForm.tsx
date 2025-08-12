import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

function isUUID(str: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export default function ThoughtForm() {
  const [content, setContent] = useState("");
  const [senderId, setSenderId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [timeframe, setTimeframe] = useState<number>(86400); // 24h default

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSender = senderId.trim();
    const trimmedRecipient = recipientId.trim();

    if (!isUUID(trimmedSender) || !isUUID(trimmedRecipient)) {
      alert("Invalid UUID format. Check both sender and recipient.");
      return;
    }

    const { error } = await supabase.from("thoughts").insert([
      {
        content: content || null,
        sender_id: trimmedSender,
        recipient_id: trimmedRecipient,
        timeframe_seconds: timeframe,
      },
    ]);

    if (error) {
      alert("Failed to send thought: " + error.message);
      return;
    }

    alert("Thought sent successfully!");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Send a Thought</h2>
      <input
        placeholder="Sender ID"
        value={senderId}
        onChange={(e) => setSenderId(e.target.value)}
      />
      <input
        placeholder="Recipient ID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
      <textarea
        placeholder="Your thought (optional)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="number"
        placeholder="Timeframe in seconds (e.g. 86400)"
        value={timeframe}
        onChange={(e) => setTimeframe(Number(e.target.value))}
      />
      <button type="submit">Send Thought</button>
    </form>
  );
}
