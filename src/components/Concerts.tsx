import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const mockConcerts = [
  {
    id: "1",
    name: "Arijit Singh Live",
    date: "2025-08-10",
    time: "19:30",
    venue: "Gachibowli Stadium",
    city: "Hyderabad",
    image: "/images/arijit.jpg", 
    price: 1499,
  },
  {
    id: "2",
    name: "Prateek Kuhad India Tour",
    date: "2025-09-02",
    time: "20:00",
    venue: "Phoenix Arena",
    city: "Bengaluru",
    image: "/images/prateek.jpg",
    price: 1199,
  },
  {
    id: "3",
    name: "Sunburn Goa Festival",
    date: "2025-12-28",
    time: "18:00",
    venue: "Candolim Beach",
    city: "Goa",
    image: "/images/sunburn.jpg",
    price: 2499,
  },
];

const Concerts: React.FC = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/concerts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch concerts");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched concerts:", data);
        setConcerts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading concerts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full pt-20 bg-gray-50 dark:bg-gray-700 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        🎤 Upcoming Concerts
      </h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 sm:px-4 md:px-8">
        {concerts.length === 0 ? (
          <div className="text-center col-span-full text-gray-500 dark:text-gray-300 text-lg mt-8">
            No concerts found.
          </div>
        ) : (
          concerts.map((concert) => (
            <div
              key={concert.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={concert.image}
                alt={concert.name}
                className="w-full h-80 md:h-96 lg:h-[28rem] object-cover object-top"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {concert.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {concert.date} at {concert.time}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📍 {concert.venue}, {concert.city}
                </p>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  ₹{concert.price} per ticket
                </p>
                <Link
                  to={`/concert/${concert.id}`}
                  className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Concerts;
