import axios from "axios";
import HistoryData from "../models/historyDataModel.js";
import CurrentData from "../models/currentDataModel.js";

// export const getCoins = async (req, res) => {
//     try {
//         const url =
//             "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

//         const response = await axios.get(url);
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error("Error fetching coins:", error.message);
//         res.status(500).json({ error: "Failed to fetch coin data" });
//     }
// };

import axios from "axios";
import HistoryData from "../models/historyDataModel.js";
import CurrentData from "../models/currentDataModel.js";

export const getCoins = async (req, res) => {
    try {
        // Try reading from DB first
        const cachedData = await CurrentData.find({});
        if (cachedData.length > 0) {
            return res.status(200).json(cachedData);
        }

        // Fallback: fetch from API only if DB empty
        const url =
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "CryptoTracker/1.0",
                "Accept": "application/json",
            },
        });

        // Save to DB for next time
        await CurrentData.deleteMany({});
        await CurrentData.insertMany(response.data);

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching coins:", error.message);
        res.status(500).json({ error: "Failed to fetch coin data" });
    }
};



export const saveHistory = async (req, res) => {
    try {
        const url =
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
        const { data } = await axios.get(url);

        await CurrentData.deleteMany({});
        const docs = data.map((coin) => ({
            coinId: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            price: coin.current_price,
            marketCap: coin.market_cap,
            change24h: coin.price_change_percentage_24h,
            timestamp: new Date(),
        }));

        await CurrentData.insertMany(docs);
        await HistoryData.insertMany(docs);

        res.status(201).json({ message: "Data saved successfully!" });
    } catch (error) {
        console.error("Error saving history:", error.message);
        res.status(500).json({ error: "Failed to save history data" });
    }
};

export const getCoinHistory = async (req, res) => {
    try {
        const { coinId } = req.params;
        const data = await HistoryData.find({ coinId }).sort({ timestamp: 1 });
        res.json(data);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error fetching coin history", error: err.message });
    }
};

