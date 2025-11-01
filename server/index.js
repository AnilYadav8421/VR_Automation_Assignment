import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import cron from "node-cron";
import { connectDB } from "./config/db.js";
import coinRoutes from "./routes/coinRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import CurrentData from "./models/currentDataModel.js";
import HistoryData from "./models/historyDataModel.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/coins", coinRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.send("Crypto Tracker Backend is running!");
});

const PORT = process.env.PORT || 5000;

cron.schedule("0 * * * *", async () => {

  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
    const { data } = await axios.get(url);

    const formattedData = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date(),
    }));

    await CurrentData.deleteMany({});
    await CurrentData.insertMany(formattedData);

    await HistoryData.insertMany(formattedData);

  } catch (error) {
    console.error("Cron job failed:", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
