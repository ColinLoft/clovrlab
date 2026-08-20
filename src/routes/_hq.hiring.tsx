import { createFileRoute } from "@tanstack/react-router";
import { UserSearch, ClipboardCheck } from "lucide-react";
import { ResourcePage, StatusBadge, DateCell, UserCell, type ResourceConfig } from "@/components/hq/ResourcePage";
import { useState } from "react";



const applicantsCfg: ResourceConfig<any> = {
  table: "hr_applicants",
  title: "Applicants",
  eyebrow: "People",
  icon: UserSearch,
  itemName: "applicant",
  orderBy: { column: "created_at", ascending: false },
  searchable: ["name", "email", "role", "department"],
  defaults: { stage: "applied" },
  kpis: (rows) => [
    { label: "Applicants", value: rows.length, icon: UserSearch },
    { label: "Interviewing", value: rows.filter((r) => r.stage === "interview").length, icon: UserSearch },
    { label: "Offers out", value: rows.filter((r) => r.stage === "offer").length, icon: UserSearch },
    { label: "Hired", value: rows.filter((r) => r.stage === "hired").length, icon: UserSearch },
  ],
  columns: [
    { key: "name", label: "Candidate", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "role", label: "Role" },
    { key: "department", label: "Team" },
    { key: "stage", label: "Stage", render: (r) => <StatusBadge value={r.stage} /> },
    { key: "interviewer_id", label: "Interviewer", render: (r, ctx) => <UserCell userId={r.interviewer_id} profiles={ctx.profiles} /> },
    { key: "interview_date", label: "Interview", render: (r) => <DateCell date={r.interview_date} /> },
    { key: "source", label: "Source" },
  ],
  fields: [
    { key: "name", label: "Full name", type: "text", required: true },
    { key: "email", label: "Email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "role", label: "Role applied for", type: "text" },
    { key: "department", label: "Team", type: "text" },
    { key: "stage", label: "Stage", type: "select", required: true, options: ["applied", "screening", "interview", "offer", "hired", "rejected"].map((v) => ({ value: v, label: v })) },
    { key: "source", label: "Source", type: "text" },
    { key: "interviewer_id", label: "Interviewer", type: "user" },
    { key: "interview_date", label: "Interview date", type: "date" },
    { key: "resume_url", label: "Resume link", type: "text", full: true },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ],
};

const onboardingCfg: ResourceConfig<any> = {
  table: "hr_onboarding",
  title: "Onboarding Tasks",
  eyebrow: "People",
  icon: ClipboardCheck,
  itemName: "task",
  orderBy: { column: "due_date", ascending: true },
  searchable: ["task", "category"],
  defaults: { status: "pending" },
  kpis: (rows) => [
    { label: "Tasks", value: rows.length, icon: ClipboardCheck },
    { label: "Pending", value: rows.filter((r) => r.status === "pending").length, icon: ClipboardCheck },
    { label: "In progress", value: rows.filter((r) => r.status === "in_progress").length, icon: ClipboardCheck },
    { label: "Done", value: rows.filter((r) => r.status === "done").length, icon: ClipboardCheck },
  ],
  columns: [
    { key: "task", label: "Task", render: (r) => <span className="font-medium">{r.task}</span> },
    { key: "category", label: "Category", render: (r) => <StatusBadge value={r.category} /> },
    { key: "assignee_id", label: "Assignee", render: (r, ctx) => <UserCell userId={r.assignee_id} profiles={ctx.profiles} /> },
    { key: "due_date", label: "Due", render: (r) => <DateCell date={r.due_date} /> },
    { key: "status", label: "Status", render: (r) => <StatusBadge value={r.status} palette={{ pending: "border-border bg-muted/40", in_progress: "border-blue-500/20 bg-blue-500/10 text-blue-600", done: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" }} /> },
  ],
  fields: [
    { key: "task", label: "Task", type: "text", required: true, full: true },
    { key: "category", label: "Category", type: "select", options: ["Paperwork","Equipment","Access","Training","Intro","Benefits"].map((v) => ({ value: v, label: v })) },
    { key: "assignee_id", label: "Assignee", type: "user" },
    { key: "due_date", label: "Due date", type: "date" },
    { key: "status", label: "Status", type: "select", options: [{ value: "pending", label: "Pending" }, { value: "in_progress", label: "In progress" }, { value: "done", label: "Done" }, { value: "blocked", label: "Blocked" }], required: true },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ],
};

function HiringPage() {
  const [tab, setTab] = useState<"applicants" | "onboarding">("applicants");
  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <div className="inline-flex rounded-lg border border-border bg-card p-1 text-sm">
          <button onClick={() => setTab("applicants")} className={`px-3 py-1.5 rounded-md ${tab === "applicants" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Applicants</button>
          <button onClick={() => setTab("onboarding")} className={`px-3 py-1.5 rounded-md ${tab === "onboarding" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Onboarding</button>
        </div>
      </div>
      <ResourcePage key={tab} config={tab === "applicants" ? applicantsCfg : onboardingCfg} />
    </div>
  );
}

export const Route = createFileRoute("/_hq/hiring")({
  head: () => ({ meta: [{ title: "Hiring & Onboarding — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: HiringPage,
});
