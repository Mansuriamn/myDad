const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql');
// Load environment variables
dotenv.config();
const _dirname = path.resolve();

const app = express();

// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*',  // Be more restrictive in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(_dirname, "/frontend/dist")));

 const jokes = [
  {
    "id": 1,
    "title": "Math Teacher's Joke",
    "body": "Why was the math book sad? It had too many problems!"
  },
  {
    "id": 2,
    "title": "Ghost's Favorite Room",
    "body": "Where do ghosts go to vacation? The Boo-hamas!"
  },
  {
    "id": 3,
    "title": "Bread's Job",
    "body": "Why did the bread get a job? It wanted to make some dough!"
  },
  {
    "id": 4,
    "title": "Shark Dinner",
    "body": "What do you call a shark that delivers food? A jaw-dropping service!"
  },
  {
    "id": 5,
    "title": "Broken Pencil",
    "body": "Why don't you write with a broken pencil? Because it’s pointless!"
  },
  {
    "id": 6,
    "title": "Scarecrow Promotion",
    "body": "Why did the scarecrow win an award? He was outstanding in his field!"
  },
  {
    "id": 7,
    "title": "Beach Secret",
    "body": "Why don’t skeletons fight each other? They don’t have the guts!"
  },
  {
    "id": 8,
    "title": "Elevator Joke",
    "body": "Why did the elevator get a promotion? It’s always uplifting!"
  },
  {
    "id": 9,
    "title": "Lazy Fish",
    "body": "Why don’t fish play basketball? They’re afraid of the net!"
  },
  {
    "id": 10,
    "title": "Angry Computer",
    "body": "Why was the computer cold? It left its Windows open!"
  },
  {
    "id": 11,
    "title": "Banana Split",
    "body": "Why did the banana go to the doctor? It wasn’t peeling well!"
  },
  {
    "id": 12,
    "title": "Pirate’s Favorite Letter",
    "body": "What’s a pirate’s favorite letter? You’d think R, but it’s the C!"
  },
  {
    "id": 13,
    "title": "Calendar Woes",
    "body": "Why did the calendar get arrested? It had too many dates!"
  },
  {
    "id": 14,
    "title": "Tired Egg",
    "body": "Why was the egg so tired? It had been scrambling all day!"
  },
  {
    "id": 15,
    "title": "Music Note",
    "body": "Why did the music teacher go to jail? She got caught with sharp notes!"
  },
  {
    "id": 16,
    "title": "Tomato Blush",
    "body": "Why did the tomato turn red? Because it saw the salad dressing!"
  },
  {
    "id": 17,
    "title": "Bee Favorite Flower",
    "body": "What kind of flowers do bees love? Bee-gonias!"
  },
  {
    "id": 18,
    "title": "Frog's Car",
    "body": "What kind of car does a frog drive? A Beetle!"
  },
  {
    "id": 19,
    "title": "Library Shush",
    "body": "Why did the librarian get kicked out of the bar? She was overbooked!"
  },
  {
    "id": 20,
    "title": "Camping Joke",
    "body": "Why don’t we tell secrets in a cornfield? Too many ears!"
  },
  {
    "id": 21,
    "title": "Clean Joke",
    "body": "Why did the toilet roll down the hill? To get to the bottom!"
  },
  {
    "id": 22,
    "title": "Duck's Lawyer",
    "body": "What’s a duck’s favorite lawyer? A quack-titioner!"
  },
  {
    "id": 23,
    "title": "Cookie Scared",
    "body": "Why was the cookie sad? It was feeling crumby!"
  },
  {
    "id": 24,
    "title": "Fast Snail",
    "body": "What’s a snail’s favorite ride? A shell-evator!"
  },
  {
    "id": 25,
    "title": "Tree Whisper",
    "body": "What did one tree say to the other? I’m rooting for you!"
  },
  {
    "id": 26,
    "title": "Cow Fun",
    "body": "Why don’t cows wear shoes? They lactose!"
  },
  {
    "id": 27,
    "title": "Bad Art",
    "body": "Why did the painting go to jail? It was framed!"
  },
  {
    "id": 28,
    "title": "Stuck Fish",
    "body": "Why are fish so bad at tennis? They keep hitting the net!"
  },
  {
    "id": 29,
    "title": "Teacher’s Clock",
    "body": "Why was the clock punished? It was ticking off the teacher!"
  },
  {
    "id": 30,
    "title": "Bicycle Standing",
    "body": "Why can’t a bicycle stand on its own? It’s two-tired!"
  }
];

// API endpoint to fetch jokes
app.get('/post', async (req, res) => {
  res.json(jokes);
});


// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Please try again later'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});