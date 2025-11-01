import { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const CoinChart = ({ coinId, onClose }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/history/${coinId}`);
                const formatted = res.data.map((item) => ({
                    time: new Date(item.timestamp).toLocaleTimeString(),
                    price: item.price,
                }));
                setData(formatted);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching history:", err);
            }
        };
        fetchHistory();
    }, [coinId]);

    useEffect(() => {
        const handleEsc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose} 
            >
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full mx-4 relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    onClick={(e) => e.stopPropagation()} 
                >
                    {/* Header */}
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {coinId.toUpperCase()} Price History
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-red-500 transition"
                            title="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-center text-indigo-600 animate-pulse py-20">
                            Loading chart...
                        </p>
                    ) : (
                        <div className="h-[350px] w-full bg-gradient-to-b from-indigo-50 to-white rounded-xl p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            borderRadius: "10px",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="url(#gradient)"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                                            <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CoinChart;
