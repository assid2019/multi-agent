import express from 'express';
import routerModule from './router.js';
import nlp from './nlp.js';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/agent', routerModule);

app.post('/agent/nlp', async (req, res) => {
  try {
    const { text, memory } = req.body;
    const { intent, entities } = await nlp.process(text);

    // route it
    const routerResponse = await axios.post(
      'http://localhost:3000/agent/route',
      { intent, entities, memory }
    );

    res.json(routerResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'NLP handler failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Agent listening on ${PORT}`));
