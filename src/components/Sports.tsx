import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

interface SportsEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
}

const sportsEvents: SportsEvent[] = [
  {
    id: 1,
    title: "IPL Final: CSK vs MI",
    date: "2025-08-25",
    location: "Ahmedabad",
    image:
      "https://th.bing.com/th/id/OIP.m47FmnxFZsbPVArqMP8LDwHaD4?w=342&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
  },
  {
    id: 2,
    title: "Pro Kabaddi League",
    date: "2025-09-02",
    location: "Hyderabad",
    image:
      "https://bsmedia.business-standard.com/_media/bs/img/article/2024-03/01/full/1709308983-723.jpg?im=FeatureCrop,size=(803,452)",
  },
  {
    id: 3,
    title: "ISL: Kerala Blasters vs Bengaluru FC",
    date: "2025-09-18",
    location: "Kochi",
    image:
      "https://th.bing.com/th/id/OIP.oEWtYY30Wa821BpA8Nu32QHaEK?w=295&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
  },
  {
    id: 4,
    title: "India vs Australia T20",
    date: "2025-09-10",
    location: "Hyderabad",
    image:
      "https://images.indianexpress.com/2023/11/2nd-T20I-India-vs-Australia.jpg",
  },
];

const Sports: React.FC = () => {
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/sports")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sports events");
        return res.json();
      })
      .then((data) => {
        setSports(data);
        setLoading(false);
        console.log("Fetched sports data:", data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredEvents = sports.filter((event) => {
    if (!event) return false;
    const matchLocation = locationFilter
      ? (event.location || "").toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    const matchDate = dateFilter ? event.date === dateFilter : true;
    return matchLocation && matchDate;
  });

  console.log("filteredEvents:", filteredEvents);

  if (loading) {
    return <div className="text-center mt-8">Loading sports events...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 mt-8">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 pt-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Upcoming Sports Events
      </h1>

      
      <div className="max-w-3xl mx-auto mb-10 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Filter by Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents && Array.isArray(filteredEvents) && filteredEvents.filter(
          (event) =>
            event &&
            typeof event === "object" &&
            event.id !== undefined &&
            event.title !== undefined
        ).length > 0 ? (
          filteredEvents
            .filter(
              (event) =>
                event &&
                typeof event === "object" &&
                event.id !== undefined &&
                event.title !== undefined
            )
            .map((event, idx) => (
              <div
                key={event.id ?? idx}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <img
                  src={event.image || ""}
                  alt={event.title || "Sports Event"}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title || "Untitled Event"}
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location || "TBA"}</span>
                    </div>
                  </div>

                  <Link
                    to={`/booking/sports/${event.id}/st1`}
                    className="inline-flex items-center justify-center mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Book Tickets
                  </Link>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-300 text-lg mt-8">
            No sports events match your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default Sports;
