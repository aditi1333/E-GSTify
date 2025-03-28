// Backend implementation to connect with IBM's Granite model
// This should be deployed on your server

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// IBM Granite API configuration
const IBM_API_KEY = process.env.IBM_API_KEY;
const IBM_GRANITE_URL = process.env.IBM_GRANITE_URL;

// GST and tax knowledge base for context enhancement
const taxKnowledgeBase = {
  gstRates: {
    standard: [5, 12, 18, 28],
    exempt: ['Essential food items', 'Healthcare services'],
    // Add more GST rate information
  },
  taxForms: ['GSTR-1', 'GSTR-2', 'GSTR-3B'],
  // Add more tax knowledge here
};

// Function to enhance the prompt with domain-specific context
const enhancePrompt = (query) => {
  return `As TaxGenie, an expert on Indian GST and tax compliance, please answer the following query:
${query}

Consider the latest GST regulations, tax laws, and compliance requirements in your response.`;
};

// Endpoint to query IBM's Granite model
app.post('/granite', async (req, res) => {
  try {
    const { query, context } = req.body;
    
    // Enhance the prompt with specific tax context
    const enhancedPrompt = enhancePrompt(query);
    
    // Call IBM Granite API
    const response = await axios.post(
      IBM_GRANITE_URL,
      {
        model_id: 'granite-base',
        inputs: [enhancedPrompt],
        parameters: {
          temperature: 0.2,
          max_new_tokens: 500,
          repetition_penalty: 1.1,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${IBM_API_KEY}`
        }
      }
    );
    
    // Process and send response
    const modelResponse = response.data.results[0].generated_text;
    
    res.json({
      response: modelResponse,
      source: 'IBM Granite',
    });
  } catch (error) {
    console.error('Error calling Granite API:', error);
    res.status(500).json({
      response: 'I encountered an error processing your query. Please try again later.',
      error: error.message,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`TaxGenie backend server running on port ${PORT}`);
});

module.exports = app;