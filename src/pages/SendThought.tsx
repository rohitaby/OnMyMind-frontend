import React, { useState } from "react";
import { supabase } from "../lib/supabase";

function isUUID(str: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export default function SendThought() {
  const [content, setContent] = useState("");
  const [senderId, setSenderId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [timeframe, setTimeframe] = useState<number>(86400);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const s = senderId.trim(), r = recipientId.trim();
    if (!isUUID(s) || !isUUID(r)) return alert("Invalid UUID format.");

    setLoading(true);
    const { error } = await supabase.from("thoughts").insert([
      { content: content || null, sender_id: s, recipient_id: r, timeframe_seconds: timeframe },
    ]);
    setLoading(false);

    if (error) return alert("Failed to send thought: " + error.message);
    alert("Thought sent successfully!");
    setContent("");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Send a Thought</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sender ID</label>
            <input
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient ID</label>
            <input
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your thought (optional)</label>
            <textarea
              className="mt-1 w-full min-h-[120px] rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Timeframe (seconds)</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e.target.value))}
              placeholder="86400"
            />
            <p className="mt-1 text-xs text-gray-500">24h default is <code>86400</code>.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Thought"}
          </button>
        </form>
      </div>
    </div>
  );
}
