const config = require('../../../config');
const axios = require('axios'); // Assuming axios usage for manual call or use 'openai' lib

class OpenAIAdapter {
  constructor() {
    this.apiKey = config.integrations.openai.apiKey;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async getInsights(systemPrompt, userContent) {
    try {
      // Mocking implementation if key is missing
      if (!this.apiKey || this.apiKey === 'sk-placeholder') {
        return { content: "Simulation: AI insights based on provided data." };
      }

      const response = await axios.post(
        this.apiUrl,
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message;
    } catch (error) {
      throw new Error(`OpenAI Integration Error: ${error.message}`);
    }
  }
}

module.exports = OpenAIAdapter;