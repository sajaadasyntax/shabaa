"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Edit2, Languages, LogOut, Plus, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-browser";
import { getSupabaseUrlError } from "@/lib/supabase-config";
import type { MenuCategory, MenuItem } from "@/lib/menu";

type AuthStatus = "checking" | "signedOut" | "notAdmin" | "admin";
type AdminTab = "items" | "categories";
type ItemForm = Omit<MenuItem, "id" | "position"> & { id?: string };
type CategoryForm = Omit<MenuCategory, "id" | "position"> & { id?: string };
type Language = "ar" | "en";

const translations = {
  ar: {
    language: "English",
    adminPanel: "لوحة إدارة القائمة",
    viewMenu: "عرض القائمة",
    signOut: "تسجيل الخروج",
    checking: "جارٍ التحقق من صلاحيات الإدارة...",
    loginTitle: "تسجيل دخول الإدارة",
    loginDescription: "سجّل الدخول بحساب مصرح له لتعديل القائمة المشتركة.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    signingIn: "جارٍ تسجيل الدخول...",
    configMissing: "أضف إعدادات Supabase إلى ملف .env.local، ثم نفّذ ملف الإعداد supabase/schema.sql.",
    notAdminTitle: "الحساب لا يملك صلاحية الإدارة",
    notAdminDescription: "تم تسجيل الدخول، لكن هذا الحساب غير مضاف إلى قائمة مسؤولي القائمة.",
    menuManagement: "إدارة القائمة",
    editMenu: "تعديل القائمة",
    sharedMenuNote: "تُحفظ التغييرات في القائمة المشتركة لجميع الزوار.",
    newItem: "إضافة صنف",
    newCategory: "إضافة قسم",
    items: "الأصناف",
    categories: "الأقسام",
    editItem: "تعديل الصنف",
    addItem: "إضافة صنف جديد",
    englishName: "الاسم بالإنجليزية",
    arabicName: "الاسم بالعربية",
    englishDescription: "الوصف بالإنجليزية",
    arabicDescription: "الوصف بالعربية",
    imageUrl: "رابط الصورة",
    price: "السعر",
    category: "القسم",
    chooseCategory: "اختر القسم",
    availability: "حالة العرض",
    visible: "ظاهر في القائمة",
    hidden: "مخفي عن الزبائن",
    saveItem: "حفظ الصنف",
    editCategory: "تعديل القسم",
    addCategory: "إضافة قسم جديد",
    saveCategory: "حفظ القسم",
    cancel: "إلغاء",
    saving: "جارٍ الحفظ...",
    delete: "حذف",
    edit: "تعديل",
    uncategorized: "بدون قسم",
    visibleShort: "ظاهر",
    hiddenShort: "مخفي",
    itemCount: "صنف",
    deleteItemConfirm: "هل تريد حذف هذا الصنف؟",
    deleteCategoryConfirm: "هل تريد حذف هذا القسم وجميع الأصناف التابعة له؟",
    itemSaved: "تم حفظ الصنف.",
    categorySaved: "تم حفظ القسم.",
    itemDeleted: "تم حذف الصنف.",
    categoryDeleted: "تم حذف القسم وأصنافه.",
    loadError: "تعذر تحميل القائمة.",
    reloadAfterSave: "تم الحفظ، لكن تعذر إعادة تحميل القائمة.",
    reloadAfterDelete: "تم الحذف، لكن تعذر إعادة تحميل القائمة.",
    signInError: "فشل تسجيل الدخول",
    signOutError: "فشل تسجيل الخروج",
    adminCheckError: "تعذر التحقق من صلاحيات الإدارة",
    saveItemError: "تعذر حفظ الصنف",
    saveCategoryError: "تعذر حفظ القسم",
    deleteItemError: "تعذر حذف الصنف",
    deleteCategoryError: "تعذر حذف القسم",
    authGenericError: "حدث خطأ غير متوقع.",
  },
  en: {
    language: "العربية",
    adminPanel: "Menu admin panel",
    viewMenu: "View menu",
    signOut: "Sign out",
    checking: "Checking admin access...",
    loginTitle: "Admin sign in",
    loginDescription: "Sign in with an authorized account to edit the shared menu.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in...",
    configMissing: "Add the Supabase settings to .env.local, then run supabase/schema.sql.",
    notAdminTitle: "Admin access required",
    notAdminDescription: "This account is signed in, but is not on the menu admin allowlist.",
    menuManagement: "MENU MANAGEMENT",
    editMenu: "Edit your menu",
    sharedMenuNote: "Changes are saved to the shared menu for all QR visitors.",
    newItem: "New item",
    newCategory: "New category",
    items: "Items",
    categories: "Categories",
    editItem: "Edit menu item",
    addItem: "Add menu item",
    englishName: "English name",
    arabicName: "Arabic name",
    englishDescription: "English description",
    arabicDescription: "Arabic description",
    imageUrl: "Image URL",
    price: "Price",
    category: "Category",
    chooseCategory: "Choose a category",
    availability: "Availability",
    visible: "Available on menu",
    hidden: "Hidden from customers",
    saveItem: "Save item",
    editCategory: "Edit category",
    addCategory: "Add category",
    saveCategory: "Save category",
    cancel: "Cancel",
    saving: "Saving...",
    delete: "Delete",
    edit: "Edit",
    uncategorized: "Uncategorized",
    visibleShort: "Visible",
    hiddenShort: "Hidden",
    itemCount: "items",
    deleteItemConfirm: "Delete this menu item?",
    deleteCategoryConfirm: "Delete this category and all its menu items?",
    itemSaved: "Menu item saved.",
    categorySaved: "Category saved.",
    itemDeleted: "Menu item deleted.",
    categoryDeleted: "Category and its menu items deleted.",
    loadError: "Could not load menu.",
    reloadAfterSave: "Saved, but could not reload menu.",
    reloadAfterDelete: "Deleted, but could not reload menu.",
    signInError: "Sign-in failed",
    signOutError: "Sign-out failed",
    adminCheckError: "Admin access check failed",
    saveItemError: "Could not save item",
    saveCategoryError: "Could not save category",
    deleteItemError: "Could not delete item",
    deleteCategoryError: "Could not delete category",
    authGenericError: "An unexpected error occurred.",
  },
} as const;

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
  const [language, setLanguage] = useState<Language>("ar");
  const t = translations[language];
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
      setError(`${t.adminCheckError}: ${adminError.message}`);
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
      setError(loadError instanceof Error ? loadError.message : t.loadError);
    }
  }, [loadData, supabase, t.adminCheckError, t.loadError]);

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
      setError(`${t.signInError}: ${signInError.message}`);
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
      setError(`${t.signOutError}: ${signOutError.message}`);
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
      setError(`${t.saveItemError}: ${result.error.message}`);
      return;
    }
    setItemForm(null);
    setNotice(t.itemSaved);
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t.reloadAfterSave);
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
      setError(`${t.saveCategoryError}: ${result.error.message}`);
      return;
    }
    setCategoryForm(null);
    setNotice(t.categorySaved);
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t.reloadAfterSave);
    }
  }

  async function deleteItem(item: MenuItem) {
    if (!supabase || !window.confirm(`${t.deleteItemConfirm}\n${item.name_en}`)) return;
    setBusy(true);
    setError("");
    const { error: deleteError } = await supabase.from("menu_items").delete().eq("id", item.id);
    setBusy(false);
    if (deleteError) {
      setError(`${t.deleteItemError}: ${deleteError.message}`);
      return;
    }
    setNotice(t.itemDeleted);
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t.reloadAfterDelete);
    }
  }

  async function deleteCategory(category: MenuCategory) {
    if (
      !supabase ||
      !window.confirm(`${t.deleteCategoryConfirm}\n${category.name_en}`)
    ) return;
    setBusy(true);
    setError("");
    const { error: deleteError } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", category.id);
    setBusy(false);
    if (deleteError) {
      setError(`${t.deleteCategoryError}: ${deleteError.message}`);
      return;
    }
    setNotice(t.categoryDeleted);
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t.reloadAfterDelete);
    }
  }

  return (
    <div className="admin-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="admin-header">
        <Link className="admin-brand" href="/">
          <Image src="/shahbaa-logo.jpg" alt="" width={49} height={49} />
          <span>Shahbaa<small>{t.adminPanel}</small></span>
        </Link>
        <div className="admin-actions">
          <button
            className="language-toggle"
            type="button"
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Languages size={15} /> {t.language}
          </button>
          {authStatus === "admin" && (
            <button className="logout-button" type="button" onClick={signOut} disabled={busy}>
              <LogOut size={14} /> {t.signOut}
            </button>
          )}
          <Link className="admin-back" href="/"><ArrowLeft size={14} /> {t.viewMenu}</Link>
        </div>
      </header>

      {authStatus === "checking" ? (
        <div className="menu-message">{t.checking}</div>
      ) : authStatus === "signedOut" ? (
        <main className="login-wrap">
          <form className="login-card" onSubmit={signIn}>
            <span className="menu-kicker">SHAHBAA CAFÉ</span>
            <h1>{t.loginTitle}</h1>
            <p>{t.loginDescription}</p>
            {!hasSupabaseConfig && (
              <div className="admin-warning">
                {getSupabaseUrlError(process.env.NEXT_PUBLIC_SUPABASE_URL) ??
                  t.configMissing}
              </div>
            )}
            <div className="login-fields">
              <label>
                {t.email}
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
              </label>
              <label>
              {t.password}
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
                {busy ? t.signingIn : t.signIn}
              </button>
            </div>
          </form>
        </main>
      ) : authStatus === "notAdmin" ? (
        <main className="login-wrap">
          <section className="login-card">
            <h1>{t.notAdminTitle}</h1>
            <p>{t.notAdminDescription}</p>
            {error && <div className="admin-status error">{error}</div>}
            <button className="admin-button" type="button" onClick={signOut}>{t.signOut}</button>
          </section>
        </main>
      ) : (
        <main className="admin-main">
          <div className="admin-title-row">
            <div>
              <span className="menu-kicker">{t.menuManagement}</span>
              <h1>{t.editMenu}</h1>
              <p>{t.sharedMenuNote}</p>
            </div>
            <div className="admin-actions">
              <button
                className="admin-button secondary"
                type="button"
                onClick={() => { setError(""); setNotice(""); setItemForm(emptyItem(categories[0]?.id ?? "")); }}
                disabled={!categories.length}
              >
                <Plus size={15} /> {t.newItem}
              </button>
              <button
                className="admin-button"
                type="button"
                onClick={() => { setError(""); setNotice(""); setCategoryForm({ name_en: "", name_ar: "" }); }}
              >
                <Plus size={15} /> {t.newCategory}
              </button>
            </div>
          </div>

          {error && <div className="admin-status error" role="alert">{error}</div>}
          {notice && <div className="admin-status" role="status">{notice}</div>}

          {itemForm ? (
            <form className="admin-form" onSubmit={saveItem}>
              <h2>{itemForm.id ? t.editItem : t.addItem}</h2>
              <label>{t.englishName}<input value={itemForm.name_en} onChange={(event) => setItemForm({ ...itemForm, name_en: event.target.value })} required /></label>
              <label>{t.arabicName}<input dir="rtl" value={itemForm.name_ar} onChange={(event) => setItemForm({ ...itemForm, name_ar: event.target.value })} required /></label>
              <label>{t.englishDescription}<textarea value={itemForm.description_en} onChange={(event) => setItemForm({ ...itemForm, description_en: event.target.value })} /></label>
              <label>{t.arabicDescription}<textarea dir="rtl" value={itemForm.description_ar} onChange={(event) => setItemForm({ ...itemForm, description_ar: event.target.value })} /></label>
              <label>{t.imageUrl}<input type="url" placeholder="https://..." value={itemForm.image_url ?? ""} onChange={(event) => setItemForm({ ...itemForm, image_url: event.target.value })} /></label>
              <label>{t.price}<input type="number" min="0" step="0.01" value={itemForm.price} onChange={(event) => setItemForm({ ...itemForm, price: Number(event.target.value) })} required /></label>
              <label>{t.category}<select value={itemForm.category_id} onChange={(event) => setItemForm({ ...itemForm, category_id: event.target.value })} required>{categories.map((category) => <option key={category.id} value={category.id}>{category.name_ar} / {category.name_en}</option>)}</select></label>
              <label>{t.availability}<select value={itemForm.available ? "yes" : "no"} onChange={(event) => setItemForm({ ...itemForm, available: event.target.value === "yes" })}><option value="yes">{t.visible}</option><option value="no">{t.hidden}</option></select></label>
              <div className="admin-form-buttons">
                <button className="admin-button" type="submit" disabled={busy}>{busy ? t.saving : t.saveItem}</button>
                <button className="admin-button secondary" type="button" onClick={() => setItemForm(null)}>{t.cancel}</button>
              </div>
            </form>
          ) : categoryForm ? (
            <form className="admin-form" onSubmit={saveCategory}>
              <h2>{categoryForm.id ? t.editCategory : t.addCategory}</h2>
              <label>{t.englishName}<input value={categoryForm.name_en} onChange={(event) => setCategoryForm({ ...categoryForm, name_en: event.target.value })} required /></label>
              <label>{t.arabicName}<input dir="rtl" value={categoryForm.name_ar} onChange={(event) => setCategoryForm({ ...categoryForm, name_ar: event.target.value })} required /></label>
              <div className="admin-form-buttons">
                <button className="admin-button" type="submit" disabled={busy}>{busy ? t.saving : t.saveCategory}</button>
                <button className="admin-button secondary" type="button" onClick={() => setCategoryForm(null)}>{t.cancel}</button>
              </div>
            </form>
          ) : (
            <>
              <div className="admin-tabs" role="tablist">
                <button type="button" className={tab === "items" ? "active" : ""} onClick={() => setTab("items")}>{t.items} ({items.length})</button>
                <button type="button" className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>{t.categories} ({categories.length})</button>
              </div>
              <div className="admin-list">
                {tab === "items" ? items.map((item) => (
                  <div className="admin-row" key={item.id}>
                    <div className="admin-row-copy">
                      <strong>{language === "ar" ? item.name_ar : item.name_en} · {item.price}</strong>
                      <span>{language === "ar" ? item.name_en : item.name_ar} · {categories.find((category) => category.id === item.category_id)?.[language === "ar" ? "name_ar" : "name_en"] ?? t.uncategorized} · {item.available ? t.visibleShort : t.hiddenShort}</span>
                    </div>
                    <div className="admin-row-actions">
                      <button type="button" aria-label={`${t.edit} ${item.name_ar}`} onClick={() => { setError(""); setNotice(""); setItemForm({ ...item }); }}><Edit2 size={14} /></button>
                      <button type="button" aria-label={`${t.delete} ${item.name_ar}`} onClick={() => void deleteItem(item)} disabled={busy}><Trash2 size={14} /></button>
                    </div>
                  </div>
                )) : categories.map((category) => (
                  <div className="admin-row" key={category.id}>
                    <div className="admin-row-copy">
                      <strong>{language === "ar" ? category.name_ar : category.name_en}</strong>
                      <span>{language === "ar" ? category.name_en : category.name_ar} · {items.filter((item) => item.category_id === category.id).length} {t.itemCount}</span>
                    </div>
                    <div className="admin-row-actions">
                      <button type="button" aria-label={`${t.edit} ${category.name_ar}`} onClick={() => { setError(""); setNotice(""); setCategoryForm({ ...category }); }}><Edit2 size={14} /></button>
                      <button type="button" aria-label={`${t.delete} ${category.name_ar}`} onClick={() => void deleteCategory(category)} disabled={busy}><Trash2 size={14} /></button>
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
