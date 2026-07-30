import type { Delivery } from "../../data/mockData";
import { StatusPill } from "./StatusPill";
import { Btn } from "./Btn";

interface ExtraCol {
  header: string;
  render: (r: Delivery) => React.ReactNode;
}

interface DeliveriesTableProps {
  rows: Delivery[];
  showActions?: boolean;
  extraCols?: ExtraCol[];
  onView?: (row: Delivery) => void;
  onCancel?: (row: Delivery) => void;
}

export function DeliveriesTable({
  rows,
  showActions = true,
  extraCols,
  onView,
  onCancel,
}: DeliveriesTableProps) {
  return (
    <div>
      {/* Mobile Card View (shown below md breakpoint) */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <div className="bg-white border border-[#D3EE98] rounded-xl p-4 text-center text-xs text-[#888]">
            No deliveries found.
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="bg-white border border-[#D3EE98] rounded-xl p-3.5 space-y-2.5 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-medium text-[#3a7a3e]">{row.id}</span>
                  <h4 className="font-semibold text-sm text-[#333]">{row.cargo} ({row.weight})</h4>
                </div>
                <StatusPill status={row.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#555] bg-[#f8fdf8] p-2.5 rounded-lg border border-[#D3EE98]/50">
                <div>
                  <span className="text-[#888] block text-[10px] uppercase font-medium">Pickup</span>
                  <span className="truncate block font-medium text-[#333]">{row.pickup}</span>
                </div>
                <div>
                  <span className="text-[#888] block text-[10px] uppercase font-medium">Destination</span>
                  <span className="truncate block font-medium text-[#333]">{row.destination}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#888] block text-[10px] uppercase font-medium">Driver</span>
                  <span className="font-medium text-[#333]">{row.driver || "—"}</span>
                </div>
                {extraCols?.map((c) => (
                  <div key={c.header} className="col-span-2">
                    <span className="text-[#888] block text-[10px] uppercase font-medium">{c.header}</span>
                    <div>{c.render(row)}</div>
                  </div>
                ))}
              </div>

              {showActions && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {row.proofImageUrl && (
                    <a
                      href={row.proofImageUrl.startsWith('/') ? `http://localhost:5000${row.proofImageUrl}` : row.proofImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3a7a3e] bg-[#edfae0] px-2.5 py-1 rounded-md hover:bg-[#d8f5c0] transition-colors"
                    >
                      📷 View Proof
                    </a>
                  )}
                  <Btn variant="ghost" className="flex-1 text-xs py-1.5" onClick={() => onView?.(row)}>
                    View details
                  </Btn>
                  {row.status === "Pending" && (
                    <Btn variant="danger" className="flex-1 text-xs py-1.5" onClick={() => onCancel?.(row)}>
                      Cancel
                    </Btn>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (hidden below md breakpoint) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#D3EE98]/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8fdf8] border-b border-[#D3EE98]/60">
              {[
                "ID", "Cargo", "Weight", "Pickup", "Destination", "Driver", "Status",
                ...(extraCols?.map((c) => c.header) ?? []),
                ...(showActions ? ["Actions"] : []),
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-[11px] text-[#666] font-medium uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#D3EE98]/30 hover:bg-[#f8fdf8] transition-colors"
              >
                <td className="px-3 py-2.5 text-[#3a7a3e] font-medium whitespace-nowrap">{row.id}</td>
                <td className="px-3 py-2.5 text-[#333] whitespace-nowrap">{row.cargo}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.weight}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.pickup}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.destination}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.driver}</td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <StatusPill status={row.status} />
                </td>
                {extraCols?.map((c) => (
                  <td key={c.header} className="px-3 py-2.5 whitespace-nowrap">
                    {c.render(row)}
                  </td>
                ))}
                {showActions && (
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {row.proofImageUrl && (
                        <a
                          href={row.proofImageUrl.startsWith('/') ? `http://localhost:5000${row.proofImageUrl}` : row.proofImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3a7a3e] bg-[#edfae0] px-2 py-0.5 rounded hover:bg-[#d8f5c0] transition-colors"
                        >
                          📷 Proof
                        </a>
                      )}
                      <Btn
                        variant="ghost"
                        className="text-xs py-1 px-2.5"
                        onClick={() => onView?.(row)}
                      >
                        View
                      </Btn>
                      {row.status === "Pending" && (
                        <Btn
                          variant="danger"
                          className="text-xs py-1 px-2.5"
                          onClick={() => onCancel?.(row)}
                        >
                          Cancel
                        </Btn>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
