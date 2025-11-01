import mongoose from "mongoose";

const historyDataSchema = new mongoose.Schema({
    coinId: String,
    name: String,
    symbol: String,
    price: Number,
    marketCap: Number,
    change24h: Number,
    timestamp: { type: Date, default: Date.now },
});

const HistoryData = mongoose.model("HistoryData", historyDataSchema);

export default HistoryData;
