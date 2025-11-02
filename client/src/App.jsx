import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import CoinChart from "./components/CoinChart";

function App() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://vr-automation-assignment.onrender.com/api/coins"
      );
      setCoins(res.data);
      setFilteredCoins(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const result = coins.filter(
      (coin) =>
        coin.name?.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCoins(result);
  }, [search, coins]);

  const handleSort = (type) => {
    let sorted = [...filteredCoins];
    if (type === "price") sorted.sort((a, b) => (b.current_price || 0) - (a.current_price || 0));
    if (type === "marketcap") sorted.sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
    if (type === "change")
      sorted.sort(
        (a, b) =>
          (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
      );
    setFilteredCoins(sorted);
    setSortBy(type);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-white">
        <p className="text-2xl font-semibold text-indigo-600 animate-pulse">
          Loading Data...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      <header className="py-8 text-center shadow-sm bg-white/70 backdrop-blur">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600 drop-shadow-sm">
          Top Cryptocurrencies
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Auto-refreshes every 30 minutes
        </p>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <div className="flex gap-3">
            {[
              { key: "price", label: "Price" },
              { key: "marketcap", label: "Market Cap" },
              { key: "change", label: "24h Change" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`px-4 py-2 rounded-xl font-medium border transition-all duration-200 ${sortBy === key
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white hover:bg-indigo-50 border-gray-300 text-gray-700"
                  }`}
              >
                Sort by {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto bg-white rounded-2xl shadow-md"
        >
          <table className="w-full border-collapse">
            <thead className="bg-indigo-50">
              <tr className="text-left">
                <th className="p-4">#</th>
                <th className="p-4">Name</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Price (USD)</th>
                <th className="p-4">Market Cap</th>
                <th className="p-4">24h Change</th>
                <th className="p-4">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin, index) => (
                <motion.tr
                  key={coin.id}
                  whileHover={{ scale: 1.01 }}
                  className="cursor-pointer border-b hover:bg-indigo-50/40 transition"
                  onClick={() => setSelectedCoin(coin.id)}
                >
                  <td className="p-4 font-semibold text-gray-600">
                    {index + 1}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{coin.name}</td>
                  <td className="p-4 uppercase text-gray-500">{coin.symbol}</td>
                  <td className="p-4 font-semibold">
                    ${coin.current_price?.toLocaleString() || "N/A"}
                  </td>
                  <td className="p-4">
                    ${coin.market_cap?.toLocaleString() || "N/A"}
                  </td>
                  <td
                    className={`p-4 font-semibold ${(coin.price_change_percentage_24h || 0) >= 0
                        ? "text-green-600"
                        : "text-red-500"
                      }`}
                  >
                    {coin.price_change_percentage_24h
                      ? coin.price_change_percentage_24h.toFixed(2)
                      : "0.00"}
                    %
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {coin.last_updated
                      ? new Date(coin.last_updated).toLocaleString()
                      : "N/A"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {selectedCoin && (
          <CoinChart coinId={selectedCoin} onClose={() => setSelectedCoin(null)} />
        )}
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        Built by <span className="font-semibold">Anil Y.</span> for VR Automation 🚀
      </footer>
    </div>
  );
}

export default App;
