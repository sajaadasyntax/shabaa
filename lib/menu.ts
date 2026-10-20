import { getSupabaseUrlError, readableSupabaseError } from "@/lib/supabase-config";

export type MenuCategory = {
  id: string;
  name_en: string;
  name_ar: string;
  position: number;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image_url?: string;
  price: number;
  position: number;
  available: boolean;
};

export const seedCategories: MenuCategory[] = [
  { id: "hot-drinks", name_en: "Hot drinks", name_ar: "المشروبات الساخنة", position: 0 },
  { id: "fresh-juices", name_en: "Fresh juices", name_ar: "العصائر الطازجة", position: 1 },
  { id: "milkshakes", name_en: "Milkshakes", name_ar: "الميلك شيك", position: 2 },
  { id: "cakes-desserts", name_en: "Cakes & desserts", name_ar: "الكيك والحلويات", position: 3 },
  { id: "cool-drinks", name_en: "Cool drinks", name_ar: "مشروبات منعشة", position: 4 },
];

export const seedItems: MenuItem[] = [
  { id: "turkish-coffee", category_id: "hot-drinks", name_en: "Turkish coffee", name_ar: "قهوة تركية", description_en: "", description_ar: "", price: 16, position: 0, available: true },
  { id: "espresso", category_id: "hot-drinks", name_en: "Espresso", name_ar: "إسبريسو", description_en: "", description_ar: "", price: 15, position: 1, available: true },
  { id: "lemon-tea", category_id: "hot-drinks", name_en: "Lipton tea", name_ar: "شاي ليبتون", description_en: "", description_ar: "", price: 13, position: 2, available: true },
  { id: "tea", category_id: "hot-drinks", name_en: "Tea", name_ar: "شاي", description_en: "", description_ar: "", price: 10, position: 3, available: true },
  { id: "french-coffee", category_id: "hot-drinks", name_en: "French coffee", name_ar: "قهوة فرنسية", description_en: "", description_ar: "", price: 18, position: 4, available: true },
  { id: "american-coffee", category_id: "hot-drinks", name_en: "American coffee", name_ar: "قهوة أمريكية", description_en: "", description_ar: "", price: 18, position: 5, available: true },
  { id: "cappuccino", category_id: "hot-drinks", name_en: "Cappuccino", name_ar: "كابتشينو", description_en: "", description_ar: "", price: 22, position: 6, available: true },
  { id: "nescafe", category_id: "hot-drinks", name_en: "Nescafé", name_ar: "نسكافيه", description_en: "", description_ar: "", price: 20, position: 7, available: true },
  { id: "latte", category_id: "hot-drinks", name_en: "Latte", name_ar: "لاتيه", description_en: "", description_ar: "", price: 24, position: 8, available: true },
  { id: "mocha", category_id: "hot-drinks", name_en: "Café mocha", name_ar: "كافي موكا", description_en: "", description_ar: "", price: 24, position: 9, available: true },
  { id: "hot-chocolate", category_id: "hot-drinks", name_en: "Hot chocolate", name_ar: "هوت شوكليت", description_en: "", description_ar: "", price: 25, position: 10, available: true },
  { id: "ginger-honey-lemon", category_id: "hot-drinks", name_en: "Honey, lemon & ginger", name_ar: "عسل ليمون زنجبيل", description_en: "", description_ar: "", price: 15, position: 11, available: true },
  { id: "orange-juice", category_id: "fresh-juices", name_en: "Orange", name_ar: "برتقال", description_en: "", description_ar: "", price: 18, position: 0, available: true },
  { id: "strawberry-juice", category_id: "fresh-juices", name_en: "Strawberry juice", name_ar: "عصير فراولة", description_en: "", description_ar: "", price: 18, position: 1, available: true },
  { id: "flavored-juice", category_id: "fresh-juices", name_en: "Flavored juice", name_ar: "عصير منكه", description_en: "", description_ar: "", price: 18, position: 2, available: true },
  { id: "grapefruit-juice", category_id: "fresh-juices", name_en: "Grapefruit", name_ar: "كريب فروت", description_en: "", description_ar: "", price: 16, position: 3, available: true },
  { id: "lemon-mint", category_id: "fresh-juices", name_en: "Lemon & mint", name_ar: "ليمون نعناع", description_en: "", description_ar: "", price: 16, position: 4, available: true },
  { id: "guava-orange", category_id: "fresh-juices", name_en: "Guava & orange", name_ar: "جوافة برتقال", description_en: "", description_ar: "", price: 20, position: 5, available: true },
  { id: "mixed-juice", category_id: "fresh-juices", name_en: "Mixed juice", name_ar: "نص نص مشكل", description_en: "", description_ar: "", price: 25, position: 6, available: true },
  { id: "pistachio-shake", category_id: "milkshakes", name_en: "Pistachio milkshake", name_ar: "ميلك شيك بيستاشيو", description_en: "", description_ar: "", price: 28, position: 0, available: true },
  { id: "strawberry-shake", category_id: "milkshakes", name_en: "Strawberry milkshake", name_ar: "ميلك شيك فراولة", description_en: "", description_ar: "", price: 23, position: 1, available: true },
  { id: "mango-shake", category_id: "milkshakes", name_en: "Mango milkshake", name_ar: "ميلك شيك منكه", description_en: "", description_ar: "", price: 24, position: 2, available: true },
  { id: "lotus-shake", category_id: "milkshakes", name_en: "Lotus milkshake", name_ar: "ميلك شيك لوتس", description_en: "", description_ar: "", price: 26, position: 3, available: true },
  { id: "oreo-shake", category_id: "milkshakes", name_en: "Oreo milkshake", name_ar: "ميلك شيك أوريو", description_en: "", description_ar: "", price: 25, position: 4, available: true },
  { id: "kitkat-shake", category_id: "milkshakes", name_en: "KitKat chocolate milkshake", name_ar: "ميلك شيك كيت كات شوكولاتة", description_en: "", description_ar: "", price: 28, position: 5, available: true },
  { id: "chocolate-cake", category_id: "cakes-desserts", name_en: "Chocolate cake", name_ar: "شوكولاتة كيك", description_en: "", description_ar: "", price: 25, position: 0, available: true },
  { id: "ice-cake", category_id: "cakes-desserts", name_en: "Ice cake", name_ar: "آيس كيك", description_en: "", description_ar: "", price: 28, position: 1, available: true },
  { id: "mojito", category_id: "cool-drinks", name_en: "Mojito", name_ar: "موهيتو", description_en: "", description_ar: "", price: 16, position: 0, available: true },
  { id: "fresh-mix", category_id: "cool-drinks", name_en: "Fresh mix", name_ar: "منعش فريش", description_en: "", description_ar: "", price: 20, position: 1, available: true },
  { id: "hawaiian-mix", category_id: "cool-drinks", name_en: "Hawaiian mix", name_ar: "ميكس هواي", description_en: "", description_ar: "", price: 20, position: 2, available: true },
  { id: "energy-drink", category_id: "cool-drinks", name_en: "Baba energy drink", name_ar: "بابا انرجي درنك", description_en: "", description_ar: "", price: 21, position: 3, available: true },
];

export async function getMenuData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return { categories: seedCategories, items: seedItems };
  }

  const urlError = getSupabaseUrlError(url);
  if (urlError) throw new Error(urlError);

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, anonKey);
  const [{ data: categories, error: categoryError }, { data: items, error: itemError }] =
    await Promise.all([
      supabase.from("menu_categories").select("*").order("position"),
      supabase.from("menu_items").select("*").eq("available", true).order("position"),
    ]);

  if (categoryError) {
    throw new Error(
      `Could not load menu categories: ${readableSupabaseError(categoryError.message)}`,
    );
  }
  if (itemError) {
    throw new Error(
      `Could not load menu items: ${readableSupabaseError(itemError.message)}`,
    );
  }
  return {
    categories: (categories ?? []) as MenuCategory[],
    items: (items ?? []) as MenuItem[],
  };
}
