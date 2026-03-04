"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { useApi, createJobsApi, Job, JobStatus, CreateJobInput } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Code2, Settings } from "lucide-react";
import Link from "next/link";
import { ApiCodeBlock, JOB_SNIPPETS } from "./ApiCodeBlock";

const STATUS_VARIANT: Record<JobStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  running: "default",
  completed: "outline",
  failed: "destructive",
  cancelled: "secondary",
};

function NewJobDialog({ onCreated }: { onCreated: () => void }) {
  const { apiFetch } = useApi();
  const api = createJobsApi(apiFetch);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    url: "",
    method: "POST",
    scheduled_at: new Date(Date.now() + 60_000).toISOString().slice(0, 16),
    max_retries: 3,
    timeout_seconds: 30,
    body: "",
  });

  function handleOpenChange(val: boolean) {
    setOpen(val);
    if (!val) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.create({
        url: form.url,
        method: form.method,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        max_retries: form.max_retries,
        timeout_seconds: form.timeout_seconds,
        body: form.body || undefined,
        idempotency_key: crypto.randomUUID(),
      });
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to schedule job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">New Job</Button>
      </DialogTrigger>
      <DialogContent className="bg-[#09090b] border-white/10">
        <DialogHeader>
          <DialogTitle>Schedule a Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">URL</label>
            <input
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
              required
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://example.com/webhook"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Method</label>
              <select
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none"
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Scheduled At (local)</label>
              <input
                type="datetime-local"
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Max Retries</label>
              <input
                type="number"
                min={0}
                max={20}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none"
                value={form.max_retries}
                onChange={(e) => setForm({ ...form, max_retries: Number(e.target.value) })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Timeout (seconds)</label>
              <input
                type="number"
                min={1}
                max={3600}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none"
                value={form.timeout_seconds}
                onChange={(e) => setForm({ ...form, timeout_seconds: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">Body (JSON, optional)</label>
            <textarea
              rows={3}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-white/20"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder='{"key": "value"}'
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Scheduling…" : "Schedule Job"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GettingStarted() {
  return (
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-8">
      <div className="flex flex-col gap-8 max-w-2xl">
        <div>
          <p className="text-xs text-indigo-400 uppercase tracking-widest mb-2">Get started</p>
          <h3 className="text-xl font-semibold">Schedule your first job in 3 steps</h3>
        </div>

        <div className="flex flex-col gap-7">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
              1
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Create an API token</p>
              <p className="text-xs text-white/50">
                Your token authenticates requests from your code, cron, or Postman.
              </p>
              <Link href="/app/settings">
                <Button size="sm" variant="outline" className="w-fit gap-1.5 border-white/10 hover:bg-white/5 mt-1">
                  <Settings className="h-3.5 w-3.5" />
                  Settings → API Tokens
                </Button>
              </Link>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
              2
            </div>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm font-medium">Schedule a job from your code</p>
              <p className="text-xs text-white/50">
                POST a URL + fire time — Fliq handles delivery, retries, and history.
              </p>
              <div className="mt-1">
                <ApiCodeBlock snippets={JOB_SNIPPETS} />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
              3
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Watch it run</p>
              <p className="text-xs text-white/50">
                Jobs appear here with live status, attempt history, and error details.
                Prefer the dashboard UI? Hit <span className="text-white/70">New Job</span> above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsTable() {
  const { apiFetch } = useApi();
  const api = createJobsApi(apiFetch);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { jobs } = await api.list({ limit: 50 });
      setJobs(jobs ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCancel(id: string) {
    await api.cancel(id);
    await load();
  }

  const counts = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    running: jobs.filter((j) => j.status === "running").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["total", "pending", "running", "failed"] as const).map((k) => (
          <div key={k} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs text-white/40 uppercase tracking-wider">{k}</p>
            <p className="text-2xl font-bold mt-1">
              {loading ? <Skeleton className="h-8 w-12" /> : counts[k]}
            </p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Jobs</h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white/40 hover:text-white/70 gap-1.5"
            onClick={() => setShowCode((v) => !v)}
          >
            <Code2 className="h-3.5 w-3.5" />
            {showCode ? "Hide API" : "API"}
          </Button>
          <NewJobDialog onCreated={load} />
        </div>
      </div>

      {/* API Code Examples (toggle) */}
      {showCode && <ApiCodeBlock snippets={JOB_SNIPPETS} />}

      {/* Getting started — shown until first job exists */}
      {!loading && jobs.length === 0 && <GettingStarted />}

      {/* Table — hidden when empty */}
      {(loading || jobs.length > 0) && (
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40">ID</TableHead>
              <TableHead className="text-white/40">URL</TableHead>
              <TableHead className="text-white/40">Status</TableHead>
              <TableHead className="text-white/40">Scheduled</TableHead>
              <TableHead className="text-white/40">Created</TableHead>
              <TableHead className="text-white/40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/10">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : jobs.map((job) => (
                  <TableRow key={job.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-mono text-xs text-white/60">
                      {job.id.slice(0, 8)}…
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {job.url}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[job.status]}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-white/60">
                      {formatDistanceToNow(new Date(job.scheduled_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-sm text-white/60">
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      {(job.status === "pending" || job.status === "running") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleCancel(job.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      )}
    </div>
  );
}
