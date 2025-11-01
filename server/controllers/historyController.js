import axios from "axios";
import CurrentData from "../models/currentDataModel.js";
import HistoryData from "../models/historyDataModel.js";

export const saveHistory = async (req, res) => {
    try {
        const url =
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
        const { data } = await axios.get(url);

        await CurrentData.deleteMany({});

        const currentInsert = data.map((coin) => ({
            coinId: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            price: coin.current_price,
            marketCap: coin.market_cap,
            change24h: coin.price_change_percentage_24h,
            timestamp: new Date(),
        }));

        await CurrentData.insertMany(currentInsert);
        await HistoryData.insertMany(currentInsert);

        res.status(201).json({ message: "Data saved successfully!" });
    } catch (error) {
        console.error("Error saving history:", error.message);
        res.status(500).json({ error: "Failed to save data" });
    }
};
