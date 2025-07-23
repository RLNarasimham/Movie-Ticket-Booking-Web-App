import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const concerts = [
  {
    id: "1",
    name: "Arijit Singh Live",
    date: "2025-08-10",
    time: "19:30",
    venue: "Gachibowli Stadium",
    city: "Hyderabad",
    image: "/images/arijit.jpg",
    price: 1499,
  },
  {
    id: "2",
    name: "Prateek Kuhad India Tour",
    date: "2025-09-02",
    time: "20:00",
    venue: "Phoenix Arena",
    city: "Bengaluru",
    image: "/images/prateek.jpg",
    price: 1199,
  },
  
];

const sports = [
  {
    id: "1",
    title: "IPL Final 2025",
    date: "2025-05-28",
    location: "Ahmedabad",
    image: "https://th.bing.com/th/id/OIP.m47FmnxFZsbPVArqMP8LDwHaD4?w=342&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3"
  },
  {
    id: "2",
    title: "Pro Kabaddi League",
    date: "2025-07-15",
    location: "Hyderabad",
    image: "https://bsmedia.business-standard.com/_media/bs/img/article/2024-03/01/full/1709308983-723.jpg?im=FeatureCrop,size=(803,452)"
  },
  {
    id: "3",
    title: "Indian Super League",
    date: "2025-10-10",
    location: "Goa",
    image: "https://th.bing.com/th/id/OIP.oEWtYY30Wa821BpA8Nu32QHaEK?w=295&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3"
  },
];

const theatreAndArts = [
  {
    id: "1",
    title: "Shakespeare's Hamlet - Live Play",
    date: "2025-08-28",
    location: "Mumbai",
    image:
      "https://th.bing.com/th/id/OIP.gOEMNyUr5IGHdotrrywUhQHaDQ?w=342&h=154&c=7&r=0&o=5&dpr=1.4&pid=1.7",
    type: "Theatre",
  },
  {
    id: "2",
    title: "Indian Classical Dance Show",
    date: "2025-09-05",
    location: "Chennai",
    image:
      "https://th.bing.com/th/id/OIP.NxzX5rl30wqLCt8SKaTNIAHaE8?w=270&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
    type: "Art",
  },
  {
    id: "3",
    title: "Modern Art Exhibition - Colours of Mind",
    date: "2025-09-15",
    location: "Delhi",
    image:
      "https://static.theprint.in/wp-content/uploads/2023/05/ANI-20230514095742.jpg",
    type: "Art",
  },
  {
    id: "4",
    title: "Stand-up Comedy Night",
    date: "2025-09-20",
    location: "Bangalore",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.hjTXYQg8cfU7nmXJ0QsGNgHaED?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    type: "Theatre",
  },
];


app.get("/api/concerts", (req, res) => {
  res.json(concerts);
});

app.get("/api/sports", (req, res) => {
  res.json(sports);
});

app.get("/api/theatres-arts", (req, res) => {
  res.json(theatreAndArts);
});

app.get("/api/theatres-arts/:id", (req, res) => {
  const { id } = req.params;
  console.log("/api/theatres-arts/:id requested with id:", id);
  const event = theatreAndArts.find((e) => e.id.toString() === id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ error: "Theatre/Art event not found" });
  }
});

app.get("/api/concerts/:id", (req, res) => {
  const { id } = req.params;
  const concert = concerts.find((c) => c.id.toString() === id);
  if (concert) {
    res.json(concert);
  } else {
    res.status(404).json({ error: "Concert not found" });
  }
});

app.get("/api/sports/:id", (req, res) => {
  const { id } = req.params;
  const event = sports.find((e) => e.id.toString() === id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ error: "Sports event not found" });
  }
});

const API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);

app.post("/chat", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`
You are an AI assistant integrated into a movie ticket booking web application. Help users with questions related to movie listings, show timings, booking availability, theater details, and ticket pricing.

Keep responses conversational, polite, and helpful. Answer only based on the app's features and scope. If a user asks something out of scope (e.g., international bookings, reviews, etc.), politely redirect them.

Here is the latest user query:
"${message}"
`);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Something went wrong with Gemini API" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
