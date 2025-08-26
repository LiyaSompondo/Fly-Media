import React, { useEffect, useMemo, useState } from "react";
import "../styles/TaskList.css";

// ---- Storage key ----
const STORAGE_KEY = "fm_tasks_v1";

// ---- Default seed tasks (loaded only if none exist) ----
const seedTasks = [
  {
    id: "t1",
    title: "Product Benefit Reel",
    description:
      "Create a 30-second reel highlighting your main product benefit.",
    priority: "high", // high | medium | low
    status: "todo", // todo | in_progress | review | published
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // +2 days
    estimateMins: 15,
  },
  {
    id: "t2",
    title: "Client Testimonial",
    description: "Collect and edit a short client testimonial video.",
    priority: "medium",
    status: "in_progress",
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    estimateMins: 30,
  },
  {
    id: "t3",
    title: "Behind-the-Scenes Cut",
    description: "Quick BTS of the shoot day for TikTok.",
    priority: "low",
    status: "review",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimateMins: 10,
  },
  {
    id: "t4",
    title: "Industry Tip (YouTube Short)",
    description: "Record a 45–60s tip relevant to your niche.",
    priority: "medium",
    status: "published",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimateMins: 20,
  },
];

// ---- Helpers ----
const loadTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
};

const priorityOrder = { high: 0, medium: 1, low: 2 };
const isComplete = (t) => t.status === "published";

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
};

const daysLeft = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const ms = d.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
};

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---- Component ----
export default function TaskList() {
  // tasks state
  const [tasks, setTasks] = useState(() => loadTasks() ?? seedTasks);
  // controls
  const [query, setQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all"); // all | high | medium | low
  const [filterStatus, setFilterStatus] = useState("all"); // all | todo | in_progress | review | published
  const [sortBy, setSortBy] = useState("due"); // due | priority | title
  // new task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    estimateMins: 15,
  });

  // persist
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // computed
  const completedCount = useMemo(
    () => tasks.filter(isComplete).length,
    [tasks]
  );

  const filtered = useMemo(() => {
    let list = [...tasks];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q)
      );
    }

    if (filterPriority !== "all") {
      list = list.filter((t) => t.priority === filterPriority);
    }

    if (filterStatus !== "all") {
      list = list.filter((t) => t.status === filterStatus);
    }

    // sort
    if (sortBy === "due") {
      list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "priority") {
      list.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [tasks, query, filterPriority, filterStatus, sortBy]);

  const progressPct =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  // actions
  const updateTask = (id, patch) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const t = {
      id: uid(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      status: "todo",
      dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
      estimateMins: Number(newTask.estimateMins) || 0,
    };
    setTasks((prev) => [t, ...prev]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      estimateMins: 15,
    });
  };

  const statusChip = (s) => {
    const map = {
      todo: { label: "To Do", cls: "status-todo" },
      in_progress: { label: "In Progress", cls: "status-inprogress" },
      review: { label: "In Review", cls: "status-review" },
      published: { label: "Published", cls: "status-published" },
    };
    return <span className={`status-chip ${map[s].cls}`}>{map[s].label}</span>;
  };

  const priorityBadge = (p) => {
    const label = p === "high" ? "High" : p === "low" ? "Low" : "Medium";
    return <span className={`priority-badge ${p}`}>{label} Priority</span>;
  };

  return (
    <div className="tasklist">
      {/* Header / Progress */}
      <div className="tasklist-header">
        <div>
          <h2 className="tasklist-title">Weekly Tasks</h2>
          <div className="tasklist-subtitle">
            {completedCount}/{tasks.length} Complete
          </div>
        </div>
        <div className="progress-ring" aria-label="Progress">
          <div className="progress-ring-inner">
            <div className="progress-number">{progressPct}%</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="task-controls">
        <input
          className="control-input"
          placeholder="Search tasks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="control-select"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="control-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="published">Published</option>
        </select>

        <select
          className="control-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="due">Sort: Due soonest</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      {/* Add Task */}
      <form className="task-new" onSubmit={addTask}>
        <input
          className="control-input"
          value={newTask.title}
          placeholder="New task title"
          onChange={(e) => setNewTask((n) => ({ ...n, title: e.target.value }))}
          required
        />
        <input
          className="control-input"
          value={newTask.description}
          placeholder="Short description (optional)"
          onChange={(e) =>
            setNewTask((n) => ({ ...n, description: e.target.value }))
          }
        />
        <div className="task-new-row">
          <select
            className="control-select"
            value={newTask.priority}
            onChange={(e) =>
              setNewTask((n) => ({ ...n, priority: e.target.value }))
            }
          >
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>

          <input
            className="control-input"
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask((n) => ({ ...n, dueDate: e.target.value }))
            }
          />

            <input
              className="control-input"
              type="number"
              min="0"
              value={newTask.estimateMins}
              onChange={(e) =>
                setNewTask((n) => ({ ...n, estimateMins: e.target.value }))
              }
              placeholder="mins"
              style={{ width: 100 }}
              title="Estimate (minutes)"
            />
        </div>

        <button className="btn btn-primary" type="submit">
          Add Task
        </button>
      </form>

      {/* List */}
      <div className="task-list">
        {filtered.length === 0 ? (
          <div className="empty">No tasks found.</div>
        ) : (
          filtered.map((t) => {
            const dLeft = daysLeft(t.dueDate);
            const dueClass =
              dLeft == null ? "" : dLeft < 0 ? "overdue" : dLeft <= 2 ? "soon" : "";

            return (
              <div key={t.id} className="task-card">
                <div className="task-card-head">
                  <div className="task-card-title">{t.title}</div>
                  <div className="task-card-right">
                    {priorityBadge(t.priority)}
                    {statusChip(t.status)}
                  </div>
                </div>

                {t.description && (
                  <div className="task-desc">{t.description}</div>
                )}

                <div className="task-meta">
                  <div className={`meta due ${dueClass}`}>
                    <strong>Due:</strong> {formatDate(t.dueDate)}{" "}
                    {dLeft != null && (
                      <em>
                        {dLeft < 0
                          ? `(${Math.abs(dLeft)} day${Math.abs(dLeft) !== 1 ? "s" : ""} late)`
                          : dLeft === 0
                          ? "(today)"
                          : `(in ${dLeft} day${dLeft !== 1 ? "s" : ""})`}
                      </em>
                    )}
                  </div>
                  <div className="meta">
                    <strong>Estimate:</strong> {t.estimateMins} mins
                  </div>
                </div>

                <div className="task-actions">
                  {t.status === "todo" && (
                    <>
                      <button
                        className="btn btn-outline"
                        onClick={() => updateTask(t.id, { status: "in_progress" })}
                      >
                        Start
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => updateTask(t.id, { status: "published" })}
                      >
                        Mark Complete
                      </button>
                    </>
                  )}

                  {t.status === "in_progress" && (
                    <>
                      <button
                        className="btn btn-outline"
                        onClick={() => updateTask(t.id, { status: "review" })}
                      >
                        Send to Review
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => updateTask(t.id, { status: "published" })}
                      >
                        Complete
                      </button>
                    </>
                  )}

                  {t.status === "review" && (
                    <>
                      <button
                        className="btn btn-outline"
                        onClick={() => updateTask(t.id, { status: "in_progress" })}
                      >
                        Back to In Progress
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => updateTask(t.id, { status: "published" })}
                      >
                        Approve & Publish
                      </button>
                    </>
                  )}

                  {t.status === "published" && (
                    <>
                      <button
                        className="btn btn-ghost"
                        onClick={() => updateTask(t.id, { status: "in_progress" })}
                      >
                        Reopen
                      </button>
                    </>
                  )}

                  <button className="btn btn-danger" onClick={() => deleteTask(t.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
