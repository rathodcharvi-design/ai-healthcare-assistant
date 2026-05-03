export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method === "POST") {
      try {
        const { message } = await request.json();
        console.log("Incoming request:", message);

        const aiResult = await extractIntent(message, env);
        console.log("AI intent:", aiResult);

        const booking = bookAppointment(aiResult);

        console.log("Booking response:", booking);

        return new Response(JSON.stringify({ reply: booking }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders()
          }
        });

      } catch (err) {
        console.log("Worker error:", err);
        return new Response(JSON.stringify({ reply: "Something went wrong. Please try again." }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders()
          }
        });
      }
    }

    return new Response("AI Healthcare Assistant Running 🚀");
  }
};

async function extractIntent(message, env) {
  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI healthcare scheduling assistant.
Extract appointment intent from the user message.

Return ONLY valid JSON in this format:
{
  "specialty": "dermatology | cardiology | primary_care | unknown",
  "date": "tomorrow | today | this_week | unknown",
  "reason": "short reason"
}
`
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await aiResponse.json();

  if (!data.choices) {
    console.log("OpenAI error:", data);
    return {
      specialty: "unknown",
      date: "unknown",
      reason: "unknown"
    };
  }

  return JSON.parse(data.choices[0].message.content);
}

// Mock EHR database
const mockEHR = {
  dermatology: [
    {
      provider: "Dr. Smith",
      slot: "10:00 AM tomorrow",
      location: "Dermatology Clinic - Fremont"
    },
    {
      provider: "Dr. Patel",
      slot: "2:30 PM tomorrow",
      location: "Dermatology Clinic - San Jose"
    }
  ],
  cardiology: [
    {
      provider: "Dr. Lee",
      slot: "1:00 PM tomorrow",
      location: "Cardiology Center - Fremont"
    }
  ],
  primary_care: [
    {
      provider: "Dr. Johnson",
      slot: "9:00 AM tomorrow",
      location: "Primary Care Clinic - Fremont"
    }
  ]
};

function bookAppointment(intent) {
  const specialty = intent.specialty;

  if (!mockEHR[specialty]) {
    return "I can help with dermatology, cardiology, or primary care appointments. Which specialty do you need?";
  }

  const appointment = mockEHR[specialty][0];

  return `
Appointment confirmed ✅

Specialty: ${specialty.replace("_", " ")}
Provider: ${appointment.provider}
Time: ${appointment.slot}
Location: ${appointment.location}
Reason: ${intent.reason}

This was booked through the mock EHR scheduling system.
`;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
