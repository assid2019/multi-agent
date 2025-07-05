// router.js
const express = require('express');
const router = express.Router();
const infoModule = require('./modules/info');
const systemModule = require('./modules/system');
const automationModule = require('./modules/automation');
const aiModule = require('./modules/ai');

router.post('/route', async (req, res) => {
  try {
    const { intent, entities, memory } = req.body;

    let result;

    switch (intent) {
      case 'info_retrieval':
        result = await infoModule.handle(entities, memory);
        break;
      case 'system_control':
        result = await systemModule.handle(entities, memory);
        break;
      case 'automation_task':
        result = await automationModule.handle(entities, memory);
        break;
      case 'ai_processing':
        result = await aiModule.handle(entities, memory);
        break;
      default:
        result = { reply: "I'm not sure how to help with that yet." };
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Router failed.' });
  }
});

module.exports = router;
