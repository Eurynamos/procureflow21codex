"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type Procurement = {
  id: string;
  title: string;
  department: string;
  status: string;
  createdAt: string;
};

type SortDirection = "asc" | "desc";

type SortKey = "title" | "department" | "status" | "createdAt";

const data: Procurement[] = [
  {
    id: "PR-1042",
    title: "Cloud storage renewal",
    department: "IT",
    status: "Submitted",
    createdAt: "2024-07-10"
  },
  {
    id: "PR-1045",
    title: "Legal services retainer",
    department: "Legal",
    status: "Approved",
    createdAt: "2024-07-08"
  },
  {
    id: "PR-1047",
    title: "Facilities maintenance",
    department: "Operations",
    status: "Draft",
    createdAt: "2024-07-06"
  }
];

export function ProcurementTable() {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      if (left === right) return 0;
      return left > right ? 1 : -1;
    });
    return direction === "asc" ? copy : copy.reverse();
  }, [sortKey, direction]);

  const handleSort = (nextKey: SortKey) => {
    if (nextKey === sortKey) {
      setDirection(direction === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(nextKey);
    setDirection("asc");
  };

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">
              <Button
                variant="ghost"
                className="px-0 text-slate-600"
                onClick={() => handleSort("title")}
              >
                Title
              </Button>
            </th>
            <th className="px-4 py-3">
              <Button
                variant="ghost"
                className="px-0 text-slate-600"
                onClick={() => handleSort("department")}
              >
                Department
              </Button>
            </th>
            <th className="px-4 py-3">
              <Button
                variant="ghost"
                className="px-0 text-slate-600"
                onClick={() => handleSort("status")}
              >
                Status
              </Button>
            </th>
            <th className="px-4 py-3">
              <Button
                variant="ghost"
                className="px-0 text-slate-600"
                onClick={() => handleSort("createdAt")}
              >
                Created
              </Button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {sorted.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 font-medium text-slate-900">{item.id}</td>
              <td className="px-4 py-3 text-slate-700">{item.title}</td>
              <td className="px-4 py-3 text-slate-700">{item.department}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-700">{item.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
