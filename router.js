import express from 'express';
const router = express.Router();
import infoModule from './modules/info.js';
import systemModule from './modules/system.js';
import automationModule from './modules/automation.js';
import aiModule from './modules/ai.js';

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

export default router;
