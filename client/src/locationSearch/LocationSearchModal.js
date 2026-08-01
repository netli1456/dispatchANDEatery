// components/LocationSearchModal.jsx

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Navigation,
  X,
  LocateFixed,
} from "lucide-react";

export default function LocationSearchModal({
  open,
  onClose,
  locations,
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // SEARCH THROUGH STATES, LGAS & WARDS
// Replace your current search useEffect with this smarter search

useEffect(() => {
  if (!query.trim()) {
    setResults([]);
    return;
  }

  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .trim();

  // SIMPLE FUZZY MATCH
  const similarity = (a, b) => {
    a = normalize(a);
    b = normalize(b);

    // EXACT MATCH
    if (a === b) return 100;

    // STARTS WITH
    if (a.startsWith(b) || b.startsWith(a)) return 90;

    // INCLUDES
    if (a.includes(b) || b.includes(a)) return 80;

    // WORD MATCH
    const aWords = a.split(" ");
    const bWords = b.split(" ");

    let matches = 0;

    aWords.forEach((word) => {
      if (bWords.some((w) => w.includes(word) || word.includes(w))) {
        matches++;
      }
    });

    return (matches / Math.max(aWords.length, bWords.length)) * 70;
  };

  const searchResults = [];

  locations.forEach((state) => {
    state.lgas.forEach((lga) => {
      lga.wards.forEach((ward) => {
        const q = normalize(query);

        // PRIORITY:
        // 1. LGA MATCH
        // 2. WARD MATCH
        // 3. STATE MATCH

        const lgaScore = similarity(lga.name, q);
        const wardScore = similarity(ward.name, q);
        const stateScore = similarity(state.state, q);

        let totalScore = 0;

        // PRIORITIZE LGA
        totalScore += lgaScore * 3;

        // WARD SECOND
        totalScore += wardScore * 2;

        // STATE LAST
        totalScore += stateScore;

        // EXTRA BOOST FOR DIRECT CONTAINS
        if (
          normalize(lga.name).includes(q) ||
          normalize(ward.name).includes(q)
        ) {
          totalScore += 50;
        }

        // ONLY RETURN RELEVANT RESULTS
        if (totalScore > 40) {
          searchResults.push({
            state: state.state,
            lga: lga.name,
            ward: ward.name,
            latitude: ward.latitude,
            longitude: ward.longitude,
            score: totalScore,
          });
        }
      });
    });
  });

  // REMOVE DUPLICATES
  const uniqueResults = searchResults.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.ward === item.ward &&
          t.lga === item.lga &&
          t.state === item.state
      )
  );

  // SORT BEST MATCH FIRST
  uniqueResults.sort((a, b) => b.score - a.score);

  setResults(uniqueResults.slice(0, 20));
}, [query, locations]);

  // CLOSE ON ESC
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed  inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white my-5 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Where shall we deliver to?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Search your ward, LGA or state
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div className="px-6">
          <div className="h-14 border-2 border-green-600 rounded-full px-5 flex items-center gap-3">
            <Search size={20} className="text-gray-500" />

            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location..."
              className="flex-1 outline-none bg-transparent text-lg"
            />

            {query && (
              <button onClick={() => setQuery("")}>
                <X size={18} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* CURRENT LOCATION */}
        <div className="px-6 mt-5">
          <button className="w-full h-14 rounded-2xl bg-green-50 hover:bg-green-100 transition flex items-center justify-center gap-3 text-green-700 font-semibold">
            <LocateFixed size={20} />
            Use current location
          </button>
        </div>

        {/* RESULTS */}
        <div className="mt-6 max-h-[420px] overflow-y-auto px-3 pb-4">
          {!query ? (
            <div className="px-4 py-10 text-center text-gray-400">
              Start typing to search locations
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-10 text-center text-gray-400">
              No locations found
            </div>
          ) : (
            results.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="w-full text-left px-4 py-5 rounded-2xl hover:bg-gray-50 transition border-b last:border-none"
              >
                <div className="flex gap-4">
                  {/* ICON */}
                  <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-green-700" />
                  </div>

                  {/* TEXT */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {item.ward}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {item.lga}, {item.state}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <Navigation size={13} />

                      <span>
                        {item.latitude}, {item.longitude}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}