// services/openaiService.js
const OpenAI = require('openai');

const generateGrade = async (rightAnswer, studentAnswer, marks) => {
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or another ChatGPT model
      messages: [
        { role: 'system', content: 'You are an assistant that grades answers.' },
        { role: 'user', content: `Compare the following student answer with the right answer and provide feedback along with a score out of ${marks}, the mark should be either an integer or in terms of fractions .25, .5, .75. For example, 9.5/10 or 2.25/3 or 0.75/2. Grade liberally. The response should not have any text formatting except if it works for Reactjs page. Specify the score at the first line of response, starting with 'Score: ' and feedback at the second line, starting with 'Feedback: '.\n\nRight Answer: ${rightAnswer}\nStudent Answer: ${studentAnswer}` }
      ],
      
    });
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { generateGrade };
