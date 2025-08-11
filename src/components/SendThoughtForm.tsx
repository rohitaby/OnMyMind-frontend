import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SendThoughtForm() {
  const [content, setContent] = useState("");
  const [senderId, setSenderId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [timeframe, setTimeframe] = useState(86400); // 24h default in seconds

  // Signup state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  function isUUID(str: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Signup started");
  console.log("Email:", email);
  console.log("Username:", username);
  console.log("Password length:", password.length);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    console.log("Supabase signup response data:", data);
    if (error) {
      console.error("Signup error:", error);
      alert("Signup failed: " + error.message);
    } else {
      alert("Signup successful! Check your email for confirmation.");
    }
  } catch (err) {
    console.error("Signup unexpected error:", err);
    alert("Signup failed unexpectedly. See console.");
  }
};

  const handleOAuthSignIn = async (provider: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        alert("OAuth sign-in failed: " + error.message);
        return;
      }
      // The user will be redirected, so code below may not run immediately.
      // But in case of redirect back, you can fetch the user and insert if needed.
      const user = supabase.auth.getUser();
      if (user) {
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.data.user?.id)
          .single();
        if (!existingUser && !fetchError && user.data.user) {
          await supabase.from("users").insert({
            id: user.data.user.id,
            email: user.data.user.email,
            username: user.data.user.user_metadata?.full_name || username || null,
          });
        }
      }
    } catch (err) {
      alert("OAuth sign-in failed: " + err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSender = senderId.trim();
    const trimmedRecipient = recipientId.trim();

    if (!isUUID(trimmedSender) || !isUUID(trimmedRecipient)) {
      alert("Invalid UUID format. Check both sender and recipient.");
      return;
    }

    const { data, error } = await supabase.from("thoughts").insert([
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
    <>
      <form onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <div>
        <h3>Or sign up with:</h3>
        <button type="button" onClick={() => handleOAuthSignIn("google")}>Sign Up with Google</button>
      </div>
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
    </>
  );
}