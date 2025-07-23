import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

interface TheatreEvent {
  id: string | number;
  title: string;
  date: string;
  location: string;
  image: string;
  type: "Theatre" | "Art";
}

const TheatreAndArts: React.FC = () => {
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [events, setEvents] = useState<TheatreEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:5000/api/theatres-arts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter((event) => {
    if (!event) return false;
    const matchLocation = locationFilter
      ? (event.location || "").toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    const matchDate = dateFilter ? event.date === dateFilter : true;
    return matchLocation && matchDate;
  });

  if (loading) {
    return <div className="text-center mt-8">Loading events...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 mt-8">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Theatre & Arts Events
      </h1>

      <div className="max-w-3xl mx-auto mb-10 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Filter by Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 dark:placeholder-gray-400"
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
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <img
                  src={event.image || ""}
                  alt={event.title || "Event"}
                  className="w-full h-64 object-cover object-center bg-gray-100 dark:bg-gray-900"
              />
              <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {event.title || "Untitled Event"}
                </h2>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">
                  {event.type}
                </p>
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
                    to={`/booking/theatre/${event.id}/st1`}
                    className="inline-flex items-center justify-center mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors dark:bg-purple-700 dark:hover:bg-purple-800"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Book Tickets
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400 text-lg mt-8">
            No events found for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default TheatreAndArts;
