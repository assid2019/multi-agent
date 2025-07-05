import axios from 'axios';

export async function process(text) {
  let intent = null;
  let entities = [];

  if (/weather|forecast/i.test(text)) {
    intent = 'info_retrieval';
    entities.push({ type: 'topic', value: 'weather' });
  } else if (/turn on|turn off|shutdown|restart/i.test(text)) {
    intent = 'system_control';
    entities.push({ type: 'command', value: text });
  } else if (/schedule|post|email/i.test(text)) {
    intent = 'automation_task';
    entities.push({ type: 'task', value: text });
  } else {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openrouter/auto',
          messages: [
            { role: 'system', content: 'Classify the intent and entities' },
            { role: 'user', content: text }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const classification = response.data.choices[0].message.content;
      intent = 'ai_processing';
      entities.push({ type: 'classification', value: classification });
    } catch (err) {
      console.error(err);
      intent = 'ai_processing';
      entities.push({ type: 'fallback', value: text });
    }
  }

  return { intent, entities };
}
