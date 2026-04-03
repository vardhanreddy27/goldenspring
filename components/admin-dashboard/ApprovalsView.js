import { useMemo, useState } from "react";
import Image from "next/image";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, XCircle } from "lucide-react";

function statusClass(status) {
  if (status === "Approved") return "bg-emerald-100 text-emerald-700";
  if (status === "Rejected") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

function formatDayLabel(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const day = date.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${day}${suffix} ${month}`;
}

function formatLeaveRange(startDate, endDate) {
  const start = formatDayLabel(startDate);
  const end = formatDayLabel(endDate);

  if (start === end) {
    return start;
  }

  return `${start} - ${end}`;
}

function getRequesterAvatar(request, index) {
  const avatars = ["/teacher.avif", "/teacher2.jpg", "/teacher3.avif", "/teacher4.webp"];
  const avatarByName = {
    Sowmya: "/teacher4.webp",
    Renuka: "/teacher3.avif",
    Rahul: "/teacher4.webp",
    Keerthi: "/teacher2.jpg",
    Prasad: "/teacher2.jpg",
  };

  if (avatarByName[request.name]) {
    return avatarByName[request.name];
  }

  if (request.staffType === "Non-Teaching") {
    return avatars[(index + 1) % avatars.length];
  }

  return avatars[index % avatars.length];
}

export default function ApprovalsView({ leaveRequests, onDecision }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const summary = useMemo(() => {
    const counts = { Approved: 0, Pending: 0, Rejected: 0 };
    leaveRequests.forEach((item) => {
      counts[item.status] += 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: name === "Approved" ? "#86efac" : name === "Pending" ? "#fde68a" : "#fda4af",
    }));
  }, [leaveRequests]);

  const filteredRequests = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return leaveRequests;
    }

    return leaveRequests.filter((item) => {
      return [item.name, item.role, item.staffType, item.leaveType, item.status].join(" ").toLowerCase().includes(term);
    });
  }, [leaveRequests, query]);

  const totalPages = Math.max(Math.ceil(filteredRequests.length / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, safePage]);

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Leave approvals</p>
        <h2 className="mt-1 text-2xl font-semibold">Teachers and non-teaching staff</h2>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by staff name, role, leave type or status"
            className="min-w-[16rem] flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-[#f7e2a3] focus:ring"
          />
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{filteredRequests.length} requests</span>
        </div>

        <div className="mt-4 space-y-3">
          {pageRows.map((request, index) => (
            <div key={request.id} className="relative overflow-hidden rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="absolute right-4 top-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(request.status)}`}>
                  {request.status}
                </span>
              </div>

              <div className="flex flex-col gap-4 pr-20 sm:flex-row sm:items-stretch sm:justify-between sm:pr-24">
                <div className="flex gap-3 sm:flex-1">
                  <div className="relative min-h-28 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-24">
                    <Image
                      src={getRequesterAvatar(request, index)}
                      alt={request.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 py-1">
                    <p className="font-semibold text-slate-900">{request.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {request.role} • {request.staffType} • {request.leaveType} • {request.days} day(s)
                    </p>
                    <p className="mt-1 text-xs text-slate-950">{formatLeaveRange(request.startDate, request.endDate)}</p>
                  </div>
                </div>
              </div>

              {request.status === "Pending" ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => onDecision(request.id, "Approved")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecision(request.id, "Rejected")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
          <p>
            Page {safePage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={safePage === 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={safePage === totalPages}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </article>


    </section>
  );
}
