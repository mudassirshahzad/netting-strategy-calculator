const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve frontend files

app.post('/calculate', (req, res) => {
  const { lotSize, profitPerDollar, priceStep, startingPrice, endingPrice } = req.body;
  const perLotProfitLoss = profitPerDollar * lotSize;

  let drawdown = 0;
  let totalInvestment = 0;
  let weightedPriceSum = 0;

  const positions = Math.ceil((endingPrice - startingPrice) / priceStep) + 1;

  for (let i = 0; i < positions; i++) {
    const positionPrice = startingPrice + i * priceStep;
    const lossForPosition = (endingPrice - positionPrice) * perLotProfitLoss;

    drawdown += lossForPosition;
    weightedPriceSum += positionPrice * perLotProfitLoss;
    totalInvestment += perLotProfitLoss;
  }

  const breakEvenPrice = weightedPriceSum / totalInvestment;
  const netProfit = (startingPrice - breakEvenPrice) * totalInvestment / perLotProfitLoss;

  res.json({ totalDrawdown: drawdown, breakEvenPrice, netProfit });
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
