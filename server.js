// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const routerModule = require('./router');
const nlp = require('./nlp');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/agent', routerModule);

app.post('/agent/nlp', async (req, res) => {
  try {
    const { text, memory } = req.body;
    const { intent, entities } = await nlp.process(text);

    // forward to router
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

app.listen(3000, () => console.log(`Agent running on port 3000`));
