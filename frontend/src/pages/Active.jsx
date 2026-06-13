import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Wrench,
  ClipboardList,
  Archive as ArchiveIcon,
  ArrowDownToLine,
  ArrowUpFromLine,
  ListFilter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/app-context";
import { JobCard } from "@/components/JobCard";
import ServiceDialog from "@/components/ServiceDialog";
import OddJobDialog from "@/components/OddJobDialog";
import CompleteDialog from "@/components/CompleteDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function ColumnHeader({ icon: Icon, title, count, onAdd, addLabel, testId }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
      <div className="flex items-center gap-2.5">
        <Icon className="h-5 w-5 text-blue-600" />
        <h2 className="font-heading text-xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        <span className="font-mono text-sm text-slate-400">({count})</span>
      </div>
      <button
        type="button"
        onClick={onAdd}
        data-testid={testId}
        className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_20px_-8px_rgba(37,99,235,0.7)] transition-all hover:bg-blue-700 active:scale-95"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

function EmptyState({ message, testId }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center"
      data-testid={testId}
    >
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

function FilterPill({ active, onClick, label, count, icon, tone, testId }) {
  // tone: 'neutral' | 'in' | 'out'
  const activeStyles = {
    neutral: "bg-slate-900 text-white",
    in: "bg-blue-600 text-white",
    out: "bg-amber-500 text-white",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all active:scale-95",
        active
          ? `${activeStyles[tone]} border-transparent shadow-sm`
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      {icon}
      <span>{label}</span>
      <span
        className={cn(
          "font-mono text-[10px] font-bold",
          active ? "opacity-80" : "text-slate-400",
        )}
      >
        {count}
      </span>
    </button>
  );
}

export default function ActivePage() {
  const { t, services, setServices, oddJobs, setOddJobs } = useApp();

  const [query, setQuery] = useState("");
  const [serviceDialog, setServiceDialog] = useState({
    open: false,
    editing: null,
  });
  const [oddJobDialog, setOddJobDialog] = useState({
    open: false,
    editing: null,
  });
  const [completing, setCompleting] = useState(null); // { kind, item }
  const [serviceFilter, setServiceFilter] = useState("all"); // 'all' | 'in' | 'out'

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services
      .filter((s) => s.status !== "done")
      .filter((s) => (serviceFilter === "all" ? true : s.action === serviceFilter))
      .filter((s) =>
        !q
          ? true
          : `${s.vehicle} ${s.place} ${s.notes}`.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        // Group IN first, then OUT, then by date ascending within each group
        if (a.action !== b.action) return a.action === "in" ? -1 : 1;
        return a.date.localeCompare(b.date);
      });
  }, [services, query, serviceFilter]);

  // Raw counts per action (ignoring the action filter) — used for the filter pill labels.
  const serviceCounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const open = services
      .filter((s) => s.status !== "done")
      .filter((s) =>
        !q
          ? true
          : `${s.vehicle} ${s.place} ${s.notes}`.toLowerCase().includes(q),
      );
    return {
      all: open.length,
      in: open.filter((s) => s.action === "in").length,
      out: open.filter((s) => s.action === "out").length,
    };
  }, [services, query]);

  const filteredOddJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return oddJobs
      .filter((j) => j.status !== "done")
      .filter((j) =>
        !q
          ? true
          : `${j.title} ${j.vehicle ?? ""} ${j.notes}`
              .toLowerCase()
              .includes(q),
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [oddJobs, query]);

  const handleCompleteConfirm = (people) => {
    if (!completing) return;
    const { kind, item } = completing;
    const completedAt = new Date().toISOString();
    if (kind === "service") {
      setServices((prev) =>
        prev.map((s) =>
          s.id === item.id
            ? { ...s, status: "done", people, completedAt }
            : s,
        ),
      );
    } else {
      setOddJobs((prev) =>
        prev.map((j) =>
          j.id === item.id
            ? { ...j, status: "done", people, completedAt }
            : j,
        ),
      );
    }
    toast.success("Archived", { description: item.vehicle ?? item.title });
    setCompleting(null);
  };

  const handleDeleteService = (item) => {
    setServices((prev) => prev.filter((s) => s.id !== item.id));
    toast("Deleted", { description: item.vehicle });
  };
  const handleDeleteOddJob = (item) => {
    setOddJobs((prev) => prev.filter((j) => j.id !== item.id));
    toast("Deleted", { description: item.title });
  };

  return (
    <div className="space-y-8" data-testid="active-page">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {t("activeTitle")}
        </h1>
        <p className="text-base text-slate-500">{t("activeSubtitle")}</p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-sm shadow-sm focus-visible:ring-blue-500/30"
          data-testid="search-input"
        />
      </div>

      {/* Columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Services */}
        <section
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          data-testid="services-column"
        >
          <ColumnHeader
            icon={Wrench}
            title={t("servicesTitle")}
            count={filteredServices.length}
            onAdd={() =>
              setServiceDialog({ open: true, editing: null })
            }
            addLabel={t("newServiceBtn")}
            testId="add-service-btn"
          />

          {/* IN / OUT / All filter */}
          <div
            className="mt-4 flex flex-wrap items-center gap-2"
            data-testid="service-filter"
          >
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              <ListFilter className="h-3 w-3" />
              {t("filterLabel")}
            </span>
            <FilterPill
              active={serviceFilter === "all"}
              onClick={() => setServiceFilter("all")}
              testId="service-filter-all"
              label={t("filterAll")}
              count={serviceCounts.all}
              tone="neutral"
            />
            <FilterPill
              active={serviceFilter === "in"}
              onClick={() => setServiceFilter("in")}
              testId="service-filter-in"
              icon={<ArrowDownToLine className="h-3 w-3" />}
              label={t("labelIn")}
              count={serviceCounts.in}
              tone="in"
            />
            <FilterPill
              active={serviceFilter === "out"}
              onClick={() => setServiceFilter("out")}
              testId="service-filter-out"
              icon={<ArrowUpFromLine className="h-3 w-3" />}
              label={t("labelOut")}
              count={serviceCounts.out}
              tone="out"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {filteredServices.length === 0 ? (
              <EmptyState
                message={t("serviceEmpty")}
                testId="services-empty"
              />
            ) : (
              filteredServices.map((s) => (
                <JobCard
                  key={s.id}
                  kind="service"
                  item={s}
                  onComplete={(i) =>
                    setCompleting({ kind: "service", item: i })
                  }
                  onEdit={(i) =>
                    setServiceDialog({ open: true, editing: i })
                  }
                  onDelete={handleDeleteService}
                />
              ))
            )}
          </div>
          <Link
            to="/archive"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600"
            data-testid="services-view-archive"
          >
            <ArchiveIcon className="h-3.5 w-3.5" />
            {t("viewArchive")}
          </Link>
        </section>

        {/* Odd Jobs */}
        <section
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          data-testid="oddjobs-column"
        >
          <ColumnHeader
            icon={ClipboardList}
            title={t("oddJobsTitle")}
            count={filteredOddJobs.length}
            onAdd={() => setOddJobDialog({ open: true, editing: null })}
            addLabel={t("newTaskBtn")}
            testId="add-oddjob-btn"
          />
          <div className="mt-4 flex flex-col gap-3">
            {filteredOddJobs.length === 0 ? (
              <EmptyState
                message={t("oddJobEmpty")}
                testId="oddjobs-empty"
              />
            ) : (
              filteredOddJobs.map((j) => (
                <JobCard
                  key={j.id}
                  kind="oddJob"
                  item={j}
                  onComplete={(i) =>
                    setCompleting({ kind: "oddJob", item: i })
                  }
                  onEdit={(i) =>
                    setOddJobDialog({ open: true, editing: i })
                  }
                  onDelete={handleDeleteOddJob}
                />
              ))
            )}
          </div>
          <Link
            to="/archive"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600"
            data-testid="oddjobs-view-archive"
          >
            <ArchiveIcon className="h-3.5 w-3.5" />
            {t("viewArchive")}
          </Link>
        </section>
      </div>

      {/* Dialogs */}
      {serviceDialog.open && (
        <ServiceDialog
          key={serviceDialog.editing?.id ?? "new-service"}
          open={serviceDialog.open}
          onOpenChange={(o) =>
            setServiceDialog((prev) => ({ ...prev, open: o }))
          }
          editing={serviceDialog.editing}
        />
      )}
      {oddJobDialog.open && (
        <OddJobDialog
          key={oddJobDialog.editing?.id ?? "new-oddjob"}
          open={oddJobDialog.open}
          onOpenChange={(o) =>
            setOddJobDialog((prev) => ({ ...prev, open: o }))
          }
          editing={oddJobDialog.editing}
        />
      )}
      <CompleteDialog
        open={!!completing}
        onOpenChange={(o) => {
          if (!o) setCompleting(null);
        }}
        onConfirm={handleCompleteConfirm}
      />
    </div>
  );
}
