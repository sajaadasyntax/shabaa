"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Edit2, LogOut, Plus, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-browser";
import { getSupabaseUrlError } from "@/lib/supabase-config";
import type { MenuCategory, MenuItem } from "@/lib/menu";

type AuthStatus = "checking" | "signedOut" | "notAdmin" | "admin";
type AdminTab = "items" | "categories";
type ItemForm = Omit<MenuItem, "id" | "position"> & { id?: string };
type CategoryForm = Omit<MenuCategory, "id" | "position"> & { id?: string };

const emptyItem = (categoryId: string): ItemForm => ({
  category_id: categoryId,
  name_en: "",
  name_ar: "",
  description_en: "",
  description_ar: "",
  image_url: "",
  price: 0,
  available: true,
});

export default function AdminPanel() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [tab, setTab] = useState<AdminTab>("items");
  const [itemForm, setItemForm] = useState<ItemForm | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const supabase = getSupabaseBrowserClient();

  const loadData = useCallback(async () => {
    if (!supabase) return;
    const [categoryResult, itemResult] = await Promise.all([
      supabase.from("menu_categories").select("*").order("position"),
      supabase.from("menu_items").select("*").order("position"),
    ]);
    if (categoryResult.error) throw categoryResult.error;
    if (itemResult.error) throw itemResult.error;
    setCategories((categoryResult.data ?? []) as MenuCategory[]);
    setItems((itemResult.data ?? []) as MenuItem[]);
  }, [supabase]);

  const checkAdmin = useCallback(async () => {
    if (!supabase) {
      setAuthStatus("signedOut");
      return;
    }
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setError(sessionError.message);
      setAuthStatus("signedOut");
      return;
    }
    if (!sessionData.session) {
      setAuthStatus("signedOut");
      return;
    }
    const { data, error: adminError } = await supabase.rpc("is_menu_admin");
    if (adminError) {
      setError(`Admin access check failed: ${adminError.message}`);
      setAuthStatus("notAdmin");
      return;
    }
    if (!data) {
      setAuthStatus("notAdmin");
      return;
    }
    setAuthStatus("admin");
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load menu.");
    }
  }, [loadData, supabase]);

  useEffect(() => {
    const check = setTimeout(() => void checkAdmin(), 0);
    return () => clearTimeout(check);
  }, [checkAdmin, supabase]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (signInError) {
      setError(`Sign-in failed: ${signInError.message}`);
      return;
    }
    await checkAdmin();
  }

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    const { error: signOutError } = await supabase.auth.signOut();
    setBusy(false);
    if (signOutError) {
      setError(`Sign-out failed: ${signOutError.message}`);
      return;
    }
    setAuthStatus("signedOut");
    setNotice("");
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !itemForm) return;
    setBusy(true);
    setError("");
    setNotice("");
    const { id, ...values } = itemForm;
    const result = id
      ? await supabase.from("menu_items").update(values).eq("id", id)
      : await supabase.from("menu_items").insert({
          ...values,
          id: crypto.randomUUID(),
          position: items.filter((item) => item.category_id === values.category_id).length,
        });
    setBusy(false);
    if (result.error) {
      setError(`Could not save item: ${result.error.message}`);
      return;
    }
    setItemForm(null);
    setNotice("Menu item saved.");
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Saved, but could not reload menu.");
    }
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !categoryForm) return;
    setBusy(true);
    setError("");
    setNotice("");
    const { id, ...values } = categoryForm;
    const result = id
      ? await supabase.from("menu_categories").update(values).eq("id", id)
      : await supabase.from("menu_categories").insert({
          ...values,
          id: crypto.randomUUID(),
          position: categories.length,
        });
    setBusy(false);
    if (result.error) {
      setError(`Could not save category: ${result.error.message}`);
      return;
    }
    setCategoryForm(null);
    setNotice("Category saved.");
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Saved, but could not reload menu.");
    }
  }

  async function deleteItem(item: MenuItem) {
    if (!supabase || !window.confirm(`Delete “${item.name_en}”?`)) return;
    setBusy(true);
    setError("");
    const { error: deleteError } = await supabase.from("menu_items").delete().eq("id", item.id);
    setBusy(false);
    if (deleteError) {
      setError(`Could not delete item: ${deleteError.message}`);
      return;
    }
    setNotice("Menu item deleted.");
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Deleted, but could not reload menu.");
    }
  }

  async function deleteCategory(category: MenuCategory) {
    if (
      !supabase ||
      !window.confirm(`Delete “${category.name_en}” and all its menu items?`)
    ) return;
    setBusy(true);
    setError("");
    const { error: deleteError } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", category.id);
    setBusy(false);
    if (deleteError) {
      setError(`Could not delete category: ${deleteError.message}`);
      return;
    }
    setNotice("Category and its menu items deleted.");
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Deleted, but could not reload menu.");
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link className="admin-brand" href="/">
          <Image src="/shahbaa-logo.jpg" alt="" width={49} height={49} />
          <span>Shahbaa menu<small>Admin panel</small></span>
        </Link>
        <div className="admin-actions">
          {authStatus === "admin" && (
            <button className="logout-button" type="button" onClick={signOut} disabled={busy}>
              <LogOut size={14} /> Sign out
            </button>
          )}
          <Link className="admin-back" href="/"><ArrowLeft size={14} /> View menu</Link>
        </div>
      </header>

      {authStatus === "checking" ? (
        <div className="menu-message">Checking admin access...</div>
      ) : authStatus === "signedOut" ? (
        <main className="login-wrap">
          <form className="login-card" onSubmit={signIn}>
            <span className="menu-kicker">SHAHBAA CAFÉ</span>
            <h1>Admin sign in</h1>
            <p>Sign in with an authorized account to edit the live menu.</p>
            {!hasSupabaseConfig && (
              <div className="admin-warning">
                {getSupabaseUrlError(process.env.NEXT_PUBLIC_SUPABASE_URL) ??
                  "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."}{" "}
                Then run the setup SQL in <code>supabase/schema.sql</code>.
              </div>
            )}
            <div className="login-fields">
              <label>
                Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
              </label>
              <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              </label>
              {error && <span className="admin-status error">{error}</span>}
              <button className="admin-button" type="submit" disabled={busy || !hasSupabaseConfig}>
                {busy ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </main>
      ) : authStatus === "notAdmin" ? (
        <main className="login-wrap">
          <section className="login-card">
            <h1>Admin access required</h1>
            <p>This account is signed in, but is not on the menu admin allowlist.</p>
            {error && <div className="admin-status error">{error}</div>}
            <button className="admin-button" type="button" onClick={signOut}>Sign out</button>
          </section>
        </main>
      ) : (
        <main className="admin-main">
          <div className="admin-title-row">
            <div>
              <span className="menu-kicker">MENU MANAGEMENT</span>
              <h1>Edit your menu</h1>
              <p>Changes are saved to the shared menu for all QR visitors.</p>
            </div>
            <div className="admin-actions">
              <button
                className="admin-button secondary"
                type="button"
                onClick={() => { setError(""); setNotice(""); setItemForm(emptyItem(categories[0]?.id ?? "")); }}
                disabled={!categories.length}
              >
                <Plus size={15} /> New item
              </button>
              <button
                className="admin-button"
                type="button"
                onClick={() => { setError(""); setNotice(""); setCategoryForm({ name_en: "", name_ar: "" }); }}
              >
                <Plus size={15} /> New category
              </button>
            </div>
          </div>

          {error && <div className="admin-status error" role="alert">{error}</div>}
          {notice && <div className="admin-status" role="status">{notice}</div>}

          {itemForm ? (
            <form className="admin-form" onSubmit={saveItem}>
              <h2>{itemForm.id ? "Edit menu item" : "Add menu item"}</h2>
              <label>English name<input value={itemForm.name_en} onChange={(event) => setItemForm({ ...itemForm, name_en: event.target.value })} required /></label>
              <label>Arabic name<input dir="rtl" value={itemForm.name_ar} onChange={(event) => setItemForm({ ...itemForm, name_ar: event.target.value })} required /></label>
              <label>English description<textarea value={itemForm.description_en} onChange={(event) => setItemForm({ ...itemForm, description_en: event.target.value })} /></label>
              <label>Arabic description<textarea dir="rtl" value={itemForm.description_ar} onChange={(event) => setItemForm({ ...itemForm, description_ar: event.target.value })} /></label>
              <label>Image URL<input type="url" placeholder="https://..." value={itemForm.image_url ?? ""} onChange={(event) => setItemForm({ ...itemForm, image_url: event.target.value })} /></label>
              <label>Price<input type="number" min="0" step="0.01" value={itemForm.price} onChange={(event) => setItemForm({ ...itemForm, price: Number(event.target.value) })} required /></label>
              <label>Category<select value={itemForm.category_id} onChange={(event) => setItemForm({ ...itemForm, category_id: event.target.value })} required>{categories.map((category) => <option key={category.id} value={category.id}>{category.name_en} / {category.name_ar}</option>)}</select></label>
              <label>Availability<select value={itemForm.available ? "yes" : "no"} onChange={(event) => setItemForm({ ...itemForm, available: event.target.value === "yes" })}><option value="yes">Available on menu</option><option value="no">Hidden from customers</option></select></label>
              <div className="admin-form-buttons">
                <button className="admin-button" type="submit" disabled={busy}>{busy ? "Saving..." : "Save item"}</button>
                <button className="admin-button secondary" type="button" onClick={() => setItemForm(null)}>Cancel</button>
              </div>
            </form>
          ) : categoryForm ? (
            <form className="admin-form" onSubmit={saveCategory}>
              <h2>{categoryForm.id ? "Edit category" : "Add category"}</h2>
              <label>English name<input value={categoryForm.name_en} onChange={(event) => setCategoryForm({ ...categoryForm, name_en: event.target.value })} required /></label>
              <label>Arabic name<input dir="rtl" value={categoryForm.name_ar} onChange={(event) => setCategoryForm({ ...categoryForm, name_ar: event.target.value })} required /></label>
              <div className="admin-form-buttons">
                <button className="admin-button" type="submit" disabled={busy}>{busy ? "Saving..." : "Save category"}</button>
                <button className="admin-button secondary" type="button" onClick={() => setCategoryForm(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div className="admin-tabs" role="tablist">
                <button type="button" className={tab === "items" ? "active" : ""} onClick={() => setTab("items")}>Items ({items.length})</button>
                <button type="button" className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>Categories ({categories.length})</button>
              </div>
              <div className="admin-list">
                {tab === "items" ? items.map((item) => (
                  <div className="admin-row" key={item.id}>
                    <div className="admin-row-copy">
                      <strong>{item.name_en} · {item.price}</strong>
                      <span>{item.name_ar} · {categories.find((category) => category.id === item.category_id)?.name_en ?? "Uncategorized"} · {item.available ? "Visible" : "Hidden"}</span>
                    </div>
                    <div className="admin-row-actions">
                      <button type="button" aria-label={`Edit ${item.name_en}`} onClick={() => { setError(""); setNotice(""); setItemForm({ ...item }); }}><Edit2 size={14} /></button>
                      <button type="button" aria-label={`Delete ${item.name_en}`} onClick={() => void deleteItem(item)} disabled={busy}><Trash2 size={14} /></button>
                    </div>
                  </div>
                )) : categories.map((category) => (
                  <div className="admin-row" key={category.id}>
                    <div className="admin-row-copy">
                      <strong>{category.name_en}</strong>
                      <span>{category.name_ar} · {items.filter((item) => item.category_id === category.id).length} items</span>
                    </div>
                    <div className="admin-row-actions">
                      <button type="button" aria-label={`Edit ${category.name_en}`} onClick={() => { setError(""); setNotice(""); setCategoryForm({ ...category }); }}><Edit2 size={14} /></button>
                      <button type="button" aria-label={`Delete ${category.name_en}`} onClick={() => void deleteCategory(category)} disabled={busy}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}
