// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

class StringCalculator {
  add(numbers) {
    if (!numbers) return 0;
    
    let delimiter = ',';
    let numbersStr = numbers;

    // Handle custom delimiter
    if (numbers.startsWith('//')) {
      const firstNewLine = numbers.indexOf('\n');
      delimiter = numbers.substring(2, firstNewLine);
      numbersStr = numbers.substring(firstNewLine + 1);
    }

    // Replace newlines with delimiter
    numbersStr = numbersStr.replace(/\n/g, delimiter);
    
    // Handle empty string
    if (!numbersStr) return 0;
    
    // Parse numbers and calculate sum
    const nums = numbersStr.split(delimiter)
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    
    // Check for negative numbers
    const negatives = nums.filter(num => num < 0);
    if (negatives.length > 0) {
      throw new Error(`negative numbers not allowed: ${negatives.join(',')}`);
    }
    
    return nums.reduce((sum, num) => sum + num, 0);
  }
}

const calculator = new StringCalculator();

app.post('/api/calculate', (req, res) => {
  try {
    const { numbers } = req.body;
    const result = calculator.add(numbers);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

