// services/openaiService.js
const OpenAI = require('openai');

const generateGrade = async (rightAnswer, studentAnswer) => {
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or another ChatGPT model
      messages: [
        { role: 'system', content: 'You are an assistant that grades answers.' },
        { role: 'user', content: `Compare the following student answer with the right answer and provide feedback along with a score out of 10.\n\nRight Answer: ${rightAnswer}\nStudent Answer: ${studentAnswer}` }
      ],
      
    });
    console.log(response.choices[0].message);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { generateGrade };
