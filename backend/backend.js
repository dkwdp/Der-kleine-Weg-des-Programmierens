import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = 3000;
const OLLAMA_URL = "http://localhost:11434/api/generate";

app.use(express.json());

app.post('/analyze', async (req, res) => {
  const userCode = req.body.code || "";

  const prompt = `Dieser Python Code wurde von einem Anfäger geschrieben:

\`\`\`python
${userCode}
\`\`\`

Deine Aufgabe ist es:

1. Auf **Deutsch** zu antworten.
2. Den Code auf Fehler zu überprüfen.
3. Jeden Fehler in **genau einem Satz** mit **nicht mehr als 20 Wörtern** zu erklären.
4. Gib **keine unnötigen Einleitungen oder Zusammenfassungen**.

Beginne jetzt mit der Analyse.`;

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: "mistral:7b-instruct-q4_0",
      prompt: prompt,
      stream: false
    });

    const feedback = response.data.response || "";
    res.json({ feedback });
  } catch (error) {
    console.error('Error contacting Ollama:', error.message);
    res.status(500).json({ error: 'Failed to get feedback from model.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});