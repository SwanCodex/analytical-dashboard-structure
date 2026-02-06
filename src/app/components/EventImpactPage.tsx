import { ChevronDown, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect, Fragment } from "react";

type EventImpact = {
  eventId: string;
  eventName: string;
  eventCount: number;

  avgReturn1D: number | null;
  avgReturn3D: number | null;
  avgReturn7D: number | null;
  avgReturn30D: number | null;

  volatility1D: number | null;
  volatility3D: number | null;
  volatility7D: number | null;
  volatility30D: number | null;

  dataComplete: boolean;
};

export function EventImpactPage() {
  const [eventImpacts, setEventImpacts] = useState<EventImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (eventId: string) => {
    const next = new Set(expandedRows);
    next.has(eventId) ? next.delete(eventId) : next.add(eventId);
    setExpandedRows(next);
  };

  /* ---------- Helpers ---------- */

  const extractNSEI = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return value;
    if (typeof value === "object" && "^NSEI" in value) {
      return value["^NSEI"];
    }
    return null;
  };

  const formatValue = (value: number | null) => {
    if (value === null) return "—";
    return `${value.toFixed(2)}%`;
  };

  const valueColor = (value: number | null) => {
    if (value === null) return "text-slate-400";
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  /* ---------- Data Fetch ---------- */

  useEffect(() => {
    const fetchEventImpact = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/event-impact");
        const raw = await res.json();

        const adapted: EventImpact[] = raw.aligned_results.map((item: any) => ({
          eventId: `${item.event_date}-${item.sector}`
            .toLowerCase()
            .replace(/\s+/g, "-"),

          eventName: item.sector,
          eventCount: item.article_count,

          avgReturn1D: extractNSEI(item.market_response?.t_plus_1),
          avgReturn3D: extractNSEI(item.market_response?.t_plus_3),
          avgReturn7D: extractNSEI(item.market_response?.t_plus_7),
          avgReturn30D: null,

          volatility1D: null,
          volatility3D: null,
          volatility7D: null,
          volatility30D: null,

          dataComplete: item.market_response?.data_complete ?? false,
        }));

        setEventImpacts(adapted);
      } catch (err) {
        console.error("Failed to fetch event impact data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventImpact();
  }, []);

  /* ---------- Charts ---------- */

  const returnData = eventImpacts.map((e) => ({
    name: e.eventName.replace(/ /g, "\n"),
    "1 Day": e.avgReturn1D,
    "3 Days": e.avgReturn3D,
    "7 Days": e.avgReturn7D,
    "30 Days": e.avgReturn30D,
  }));

  const volatilityData = eventImpacts.map((e) => ({
    name: e.eventName.replace(/ /g, "\n"),
    "1 Day": e.volatility1D,
    "3 Days": e.volatility3D,
    "7 Days": e.volatility7D,
    "30 Days": e.volatility30D,
  }));

  if (loading) {
    return <div className="p-8 text-slate-600">Loading event impact analysis…</div>;
  }

  /* ---------- UI ---------- */

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Event Impact Analysis
        </h1>

        <p className="text-slate-600 mb-6">
          Historical market responses to macro-economic event categories
        </p>

        {eventImpacts.some((e) => !e.dataComplete) && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Market Data Notice:</strong> Some events are still unfolding.
              Returns will populate as trading days elapse.
            </p>
          </div>
        )}

        {/* Returns Chart */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Average Market Returns
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={returnData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="1 Day" fill="#3b82f6" />
              <Bar dataKey="3 Days" fill="#8b5cf6" />
              <Bar dataKey="7 Days" fill="#10b981" />
              <Bar dataKey="30 Days" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">
            Event Impact Statistics
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Event</th>
                <th className="text-right p-3">Articles</th>
                <th className="text-right p-3">Avg 1D Return</th>
                <th className="w-10" />
              </tr>
            </thead>

            <tbody>
              {eventImpacts.map((e) => {
                const expanded = expandedRows.has(e.eventId);

                return (
                  <Fragment key={e.eventId}>
                    <tr
                      className="border-b hover:bg-slate-50 cursor-pointer text-xs"
                      onClick={() => toggleRow(e.eventId)}
                    >
                      <td className="p-3">{e.eventName}</td>
                      <td className="p-3 text-right">{e.eventCount}</td>
                      <td className={`p-3 text-right ${valueColor(e.avgReturn1D)}`}>
                        {formatValue(e.avgReturn1D)}
                      </td>
                      <td className="p-3">
                        {expanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </td>
                    </tr>

                    {expanded && (
                      <tr className="bg-slate-50">
                        <td colSpan={4} className="p-4 text-xs">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p>3D: {formatValue(e.avgReturn3D)}</p>
                              <p>7D: {formatValue(e.avgReturn7D)}</p>
                              <p>30D: {formatValue(e.avgReturn30D)}</p>
                            </div>
                            <div className="text-slate-500">
                              Volatility metrics pending
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
