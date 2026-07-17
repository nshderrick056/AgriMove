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
    <div className="overflow-x-auto rounded-xl border border-[#D3EE98]/60">
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
                  <div className="flex items-center gap-1">
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
  );
}
