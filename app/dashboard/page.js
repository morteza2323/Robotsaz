"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { useToast } from "../components/toast/ToastProvider";
import { useData } from "../context/DataContext";

/* Helpers */
const joinLine = (arr) => (Array.isArray(arr) ? arr.join(", ") : ""); // for single-line input
const joinLines = (arr) => (Array.isArray(arr) ? arr.join("\n") : ""); // for multi-line textarea

const joinCSV = (arr) => (Array.isArray(arr) ? arr.join("\n") : "");

const parseCSV = (str) =>
  (str || "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

const parseSpecs = (str) =>
  (str || "")
    .split("\n")
    .map((ln) => ln.trim())
    .filter(Boolean)
    .map((ln) => {
      const i = ln.indexOf(":");
      if (i === -1) return [ln, ""];
      return [ln.slice(0, i).trim(), ln.slice(i + 1).trim()];
    });

/* Gallery with direct upload to Arvan */
function GalleryField({
  label = "Image Gallery",
  value,
  onChange,
  folder = "uploads",
  replaceOnUpload = false,
}) {
  const [uploading, setUploading] = useState(false);
  const urls = (value || "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        // 1) get presigned url
        const r1 = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": file.type, "x-amz-acl": "public-read" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            folder,
          }),
        });
        const j1 = await r1.json();
        if (!r1.ok || !j1.uploadUrl)
          throw new Error(j1.error || "Failed to get upload URL");

        // 2) PUT to Arvan
        const r2 = await fetch(j1.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type, "x-amz-acl": "public-read" },
          body: file,
        });
        if (!r2.ok) throw new Error("Upload failed");

        uploaded.push(j1.publicUrl);
      }
      if (replaceOnUpload) {
        onChange(uploaded.join("\n"));
      } else {
        onChange([...urls, ...uploaded].join("\n"));
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeAt(i) {
    const next = urls.filter((_, idx) => idx !== i);
    onChange(next.join("\n"));
  }

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label} *</label>

      <div className={styles.uploader}>
        <label className={styles.fileBtn}>
          {uploading ? "Uploading..." : "Choose files"}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFiles}
          />
        </label>

        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="Image URLs (one per line)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {/* If you have thumbs in SCSS keep the structure here */}
      {/* <div className={styles.thumbs}> ... </div> */}

      <p className={styles.hint}>The first image will be used as the cover.</p>
    </div>
  );
}

export default function DashboardPage() {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const {
    upsertProduct,
    removeProduct,
    broadcast,
    upsertProject,
    removeProject,
  } = useData();

  /* Forms */
  const [pf, setPf] = useState({
    title: "",
    short: "",
    gallery: "",
    badges: "",
    highlights: "",
    specs: "",
  });

  const [prj, setPrj] = useState({
    title: "",
    gallery: "",
    year: "",
    status: "delivered",
    summary: "",
    overview: "",
    tags: "",
    specs: "",
  });

  const onChangePf = (e) =>
    setPf((s) => ({ ...s, [e.target.name]: e.target.value }));
  const onChangePrj = (e) =>
    setPrj((s) => ({ ...s, [e.target.name]: e.target.value }));

  /* Load lists */
  useEffect(() => {
    (async () => {
      try {
        setLoadingList(true);
        const [pRes, jRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/projects", { cache: "no-store" }),
        ]);
        const [pJson, jJson] = await Promise.all([pRes.json(), jRes.json()]);
        setProducts(Array.isArray(pJson) ? pJson : pJson?.data ?? []);
        setProjects(Array.isArray(jJson) ? jJson : jJson?.data ?? []);
      } catch {
        setProducts([]);
        setProjects([]);
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  /* Add item */
  async function handleAdd() {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (activeTab === "products") {
        if (!pf.title.trim()) throw new Error("Product title is required");
        if (!pf.short.trim()) throw new Error("Short description is required");

        const payload = {
          title: pf.title.trim(),
          short: pf.short.trim(),
          gallery: parseCSV(pf.gallery),
          badges: parseCSV(pf.badges),
          highlights: parseCSV(pf.highlights),
          specs: parseSpecs(pf.specs),
        };

        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-amz-acl": "public-read",
          },
          body: JSON.stringify(payload),
        });
        let json = {};
        try {
          json = await res.json();
        } catch {}
        const saved = json.product || json.data || (json?._id ? json : null);

        if (!res.ok || !saved || typeof saved !== "object") {
          throw new Error(json?.error || `HTTP ${res.status}`);
        }
        // ensure shape
        if (!Array.isArray(saved.gallery)) saved.gallery = [];
        if (!saved.title) saved.title = payload.title;

        setProducts((arr) => [saved, ...arr]);
        toast.success("Product saved ✅");
        setPf({
          title: "",
          short: "",
          gallery: "",
          badges: "",
          highlights: "",
          specs: "",
        });
      } else {
        if (!prj.title.trim()) throw new Error("Project title is required");
        const gallery = parseCSV(prj.gallery);
        if (!gallery.length) throw new Error("At least one image is required");
        if (!prj.summary?.trim())
          throw new Error("Project short summary is required");

        const payload = {
          title: prj.title.trim(),
          gallery,
          summary: prj.summary.trim(),

          // optionals:
          year: prj.year ? Number(prj.year) : undefined,
          status: prj.status || "delivered",
          overview: prj.overview?.trim() || "",
          tags: parseCSV(prj.tags),
          specs: parseSpecs(prj.specs),
        };

        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        let json = {};
        try {
          json = await res.json();
        } catch {}
        const saved = json.project || null;
        if (!res.ok || !saved) {
          throw new Error(json?.error || `HTTP ${res.status}`);
        }
        setProjects((p) => [saved, ...p]);
        toast.success("Project saved ✅");

        // reset form
        setPrj({
          title: "",
          gallery: "",
          summary: "",
          year: "",
          status: "delivered",
          overview: "",
          tags: "",
          specs: "",
        });
      }
    } catch (e) {
      toast.error(e.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  }

  /* Delete (local; sending real DELETE) */
  async function handleDelete(id) {
    try {
      const endpoint =
        activeTab === "products"
          ? `/api/products/${id}`
          : `/api/projects/${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json?.success)
        throw new Error(json?.error || "Delete failed");

      if (activeTab === "products") {
        setProducts((p) => p.filter((x) => x._id !== id && x.id !== id));
        removeProduct(id);
        broadcast({ type: "PRODUCT_REMOVE", id });
      } else {
        setProjects((p) => p.filter((x) => x._id !== id && x.id !== id));
        removeProject(id);
        broadcast({ type: "PROJECT_REMOVE", id });
      }

      toast.success(json.message || "Deleted successfully ✅");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error deleting item");
    }
  }

  // Delete project by numericId (explicit helper)
  async function handleDeleteProject(numericId) {
    try {
      if (!numericId) return toast.error("Invalid project id");

      const res = await fetch(`/api/projects/${numericId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Delete failed");
      }

      // update UI
      setProjects((prev) =>
        prev.filter((p) => String(p.numericId) !== String(numericId))
      );
      removeProject(numericId);
      broadcast({ type: "PROJECT_REMOVE", id: numericId });

      toast.success(json.message || "Project deleted ✅");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error deleting project");
    }
  }

  function handleEditProduct(item) {
    // switch to products tab
    setActiveTab("products");

    // fill form from item
    setPf({
      title: item.title || "",
      short: item.short || "",
      gallery: joinLines(item.gallery), // array → one URL per line
      badges: joinLine(item.badges),
      highlights: joinLine(item.highlights),
      specs: (item.specs || []).map(([k, v]) => `${k}: ${v}`).join("\n"),
    });

    // edit mode
    setEditingProductId(item._id || item.id);

    // scroll to top
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSaveProduct() {
    if (!editingProductId) return;

    try {
      if (!pf.title.trim() || !pf.short.trim()) {
        throw new Error("Title and short description are required");
      }

      const payload = {
        title: pf.title.trim(),
        short: pf.short.trim(),
        gallery: parseCSV(pf.gallery),
        badges: parseCSV(pf.badges),
        highlights: parseCSV(pf.highlights),
        specs: parseSpecs(pf.specs),
      };

      const res = await fetch(`/api/products/${editingProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json?.success || !json?.product) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      // update list
      setProducts((arr) =>
        arr.map((x) =>
          (x._id || x.id) === editingProductId ? json.product : x
        )
      );

      upsertProduct(json.product);
      broadcast({ type: "PRODUCT_UPSERT", payload: json.product });

      toast.success("Product changes saved ✅");
      cancelEditProduct();
    } catch (e) {
      toast.error(e.message || "Saving changes failed");
    }
  }

  function cancelEditProduct() {
    setEditingProductId(null);
    setPf({
      title: "",
      short: "",
      gallery: "",
      badges: "",
      highlights: "",
      specs: "",
    });
  }

  function handleEditProject(item) {
    setActiveTab("projects");

    setPrj({
      title: item.title || "",
      gallery: joinLines(item.gallery),
      summary: item.summary || "",
      year: item.year ? String(item.year) : "",
      status: item.status || "delivered",
      overview: item.overview || "",
      tags: joinLine(item.tags),
      specs: (item.specs || []).map(([k, v]) => `${k}: ${v}`).join("\n"),
    });

    setEditingProjectId(item.numericId);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSaveProject() {
    if (!editingProjectId) return;
    try {
      // minimal validation
      if (!prj.title.trim()) throw new Error("Project title is required");
      const gallery = parseCSV(prj.gallery);
      if (!gallery.length) throw new Error("At least one image is required");
      if (!prj.summary?.trim()) throw new Error("Short summary is required");

      const payload = {
        title: prj.title.trim(),
        gallery,
        summary: prj.summary.trim(),
        year: prj.year ? Number(prj.year) : undefined,
        status: prj.status || "delivered",
        overview: prj.overview?.trim() || "",
        tags: parseCSV(prj.tags),
        specs: parseSpecs(prj.specs),
      };

      const res = await fetch(`/api/projects/${editingProjectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json?.success || !json?.project) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      // replace item in UI
      setProjects((arr) =>
        arr.map((x) =>
          String(x.numericId) === String(editingProjectId) ? json.project : x
        )
      );

      upsertProject(json.project);
      broadcast({ type: "PROJECT_UPSERT", payload: json.project });

      toast.success("Project changes saved ✅");
      cancelEditProject();
    } catch (e) {
      toast.error(e.message || "Saving changes failed");
    }
  }

  function cancelEditProject() {
    setEditingProjectId(null);
    setPrj({
      title: "",
      gallery: "",
      summary: "",
      year: "",
      status: "delivered",
      overview: "",
      tags: "",
      specs: "",
    });
  }

  const list = Array.isArray(activeTab === "products" ? products : projects)
    ? activeTab === "products"
      ? products
      : projects
    : [];

  return (
    <main className={styles.dashboard}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("products")}
          className={activeTab === "products" ? styles.active : ""}
        >
          🛒 Products
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={activeTab === "projects" ? styles.active : ""}
        >
          📁 Projects
        </button>
      </div>

      <div className={styles.formBox}>
        <h2>{activeTab === "products" ? "Add Product" : "Add Project"}</h2>

        {activeTab === "products" ? (
          <form className={styles.vForm} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Product Name *</label>
              <input
                className={styles.input}
                name="title"
                value={pf.title}
                onChange={onChangePf}
                placeholder="e.g. Planetary Gearbox Model A"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Short Description *</label>
              <textarea
                className={styles.textarea}
                name="short"
                value={pf.short}
                onChange={onChangePf}
                rows={2}
                placeholder="A short description of the product…"
              />
            </div>

            <GalleryField
              value={pf.gallery}
              onChange={(v) => setPf((s) => ({ ...s, gallery: v }))}
              folder="products"
              replaceOnUpload={!!editingProductId}
            />

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Badges</label>
              <input
                className={styles.input}
                name="badges"
                value={pf.badges}
                onChange={onChangePf}
                placeholder="Precision, Industrial, ..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Highlights</label>
              <textarea
                className={styles.textarea}
                name="highlights"
                value={pf.highlights}
                onChange={onChangePf}
                rows={2}
                placeholder="High efficiency, Precise assembly, ..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Technical Specs</label>
              <textarea
                className={styles.textarea}
                name="specs"
                value={pf.specs}
                onChange={onChangePf}
                rows={3}
                placeholder={
                  "One per line: Key:Value\nExample:\nRatio: 1:20\nRated Torque: 80 Nm"
                }
              />
            </div>

            <div className={styles.actionsBar}>
              {editingProductId ? (
                <>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleSaveProduct}
                    disabled={submitting}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={cancelEditProduct}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={handleAdd}
                  disabled={submitting}
                >
                  Add
                </button>
              )}
            </div>
          </form>
        ) : (
          <form className={styles.vForm} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Project Name *</label>
              <input
                className={styles.input}
                name="title"
                value={prj.title}
                onChange={onChangePrj}
                placeholder="e.g. Robotic Bar Screen"
              />
            </div>

            <GalleryField
              value={prj.gallery}
              onChange={(v) => setPrj((s) => ({ ...s, gallery: v }))}
              folder="projects"
              replaceOnUpload={!!editingProjectId}
            />

            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Year</label>
                <input
                  className={styles.input}
                  name="year"
                  value={prj.year}
                  onChange={onChangePrj}
                  inputMode="numeric"
                  placeholder="2025"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Status</label>
                <select
                  name="status"
                  value={prj.status}
                  onChange={onChangePrj}
                  className={`${styles.input} ${styles.select}`}
                >
                  <option value="delivered">Delivered</option>
                  <option value="in-progress">In progress</option>
                  <option value="prototype">Prototype</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Short Summary *</label>
              <input
                className={styles.input}
                name="summary"
                value={prj.summary}
                onChange={onChangePrj}
                placeholder="One-line project summary…"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Project Overview</label>
              <textarea
                className={styles.textarea}
                name="overview"
                value={prj.overview}
                onChange={onChangePrj}
                rows={3}
                placeholder="Detailed project description…"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Tags</label>
              <input
                className={styles.input}
                name="tags"
                value={prj.tags}
                onChange={onChangePrj}
                placeholder="Sewage, IoT, ..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Technical Specs</label>
              <textarea
                className={styles.textarea}
                name="specs"
                value={prj.specs}
                onChange={onChangePrj}
                rows={3}
                placeholder={"One per line: Key:Value"}
              />
            </div>

            <div className={styles.actionsBar}>
              {editingProjectId ? (
                <>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleSaveProject}
                    disabled={submitting}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={cancelEditProject}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={handleAdd}
                  disabled={submitting}
                >
                  Add
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* List */}
      <div className={styles.listBox}>
        <h2>
          {activeTab === "products" ? "Product List" : "Project List"}
          {loadingList ? " (Loading…)" : ""}
        </h2>

        {/* Large cards list */}
        <div className={styles.cardsGrid}>
          {list.length === 0 ? (
            <p className={styles.empty}>No items yet.</p>
          ) : (
            list
              .filter((it) => it && typeof it === "object")
              .map((item, idx) => {
                const id = item._id || item.id || `row-${idx}`;
                const cover = Array.isArray(item.gallery)
                  ? item.gallery[0]
                  : undefined;
                const pid = item.numericId ?? "—"; // numeric id chip

                return (
                  <article key={id} className={styles.itemCard}>
                    <div className={styles.mediaWrap}>
                      {cover ? (
                        <img src={cover} alt={item.title || ""} />
                      ) : (
                        <div className={styles.placeholder}>No image</div>
                      )}
                      <div className={styles.idChip}>#{pid}</div>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.cardHead}>
                        <h3 className={styles.cardTitle}>
                          {item.title || "—"}
                        </h3>

                        {/* show status only for projects tab */}
                        {activeTab === "projects" && item.status && (
                          <span
                            className={`${styles.status} ${
                              styles[item.status] || ""
                            }`}
                            title={item.status}
                          >
                            {statusLabel(item.status)}
                          </span>
                        )}
                      </div>

                      {/* short/summary */}
                      {activeTab === "products" ? (
                        item.short && (
                          <p className={styles.cardText}>{item.short}</p>
                        )
                      ) : (
                        <p className={styles.cardText}>
                          {item.year ? `Year ${item.year}` : "—"}
                          {item.status ? ` • ${statusLabel(item.status)}` : ""}
                        </p>
                      )}

                      {/* badges (products) or tags (projects) */}
                      {(
                        activeTab === "products"
                          ? Array.isArray(item.badges) && item.badges.length
                          : Array.isArray(item.tags) && item.tags.length
                      ) ? (
                        <div className={styles.badgeRow}>
                          {(activeTab === "products" ? item.badges : item.tags)
                            .slice(0, 6)
                            .map((b, i) => (
                              <span key={i} className={styles.badge}>
                                {b}
                              </span>
                            ))}
                        </div>
                      ) : null}

                      <div className={styles.cardActions}>
                        {activeTab === "products" ? (
                          <button
                            className={styles.btnGhost}
                            onClick={() => handleEditProduct(item)}
                          >
                            Edit
                          </button>
                        ) : (
                          <button
                            className={styles.btnGhost}
                            onClick={() => handleEditProject(item)}
                          >
                            Edit
                          </button>
                        )}
                        {activeTab === "products" ? (
                          <button
                            onClick={() => handleDelete(id)}
                            className={styles.btnDanger}
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteProject(item.numericId)}
                            className={styles.btnDanger}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
          )}
        </div>
      </div>
    </main>
  );
}

function statusLabel(s) {
  return (
    {
      delivered: "Delivered",
      "in-progress": "In progress",
      prototype: "Prototype",
    }[s] || s
  );
}
