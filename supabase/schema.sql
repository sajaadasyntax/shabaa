create table if not exists public.menu_categories (
  id text primary key,
  name_en text not null,
  name_ar text not null,
  position integer not null default 0
);

create table if not exists public.menu_items (
  id text primary key,
  category_id text not null references public.menu_categories(id) on delete cascade,
  name_en text not null,
  name_ar text not null,
  description_en text not null default '',
  description_ar text not null default '',
  image_url text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  position integer not null default 0,
  available boolean not null default true
);

alter table public.menu_items
  add column if not exists image_url text not null default '';

create table if not exists public.menu_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.menu_admins enable row level security;

create or replace function public.is_menu_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.menu_admins where user_id = auth.uid()
  );
$$;

grant select on public.menu_categories to anon, authenticated;
grant select on public.menu_items to anon, authenticated;
grant insert, update, delete on public.menu_categories to authenticated;
grant insert, update, delete on public.menu_items to authenticated;
revoke all on function public.is_menu_admin() from public;
grant execute on function public.is_menu_admin() to anon, authenticated;

drop policy if exists "Public can read menu categories" on public.menu_categories;
create policy "Public can read menu categories"
  on public.menu_categories for select to anon, authenticated using (true);

drop policy if exists "Menu admins can insert categories" on public.menu_categories;
create policy "Menu admins can insert categories"
  on public.menu_categories for insert to authenticated
  with check (public.is_menu_admin());

drop policy if exists "Menu admins can update categories" on public.menu_categories;
create policy "Menu admins can update categories"
  on public.menu_categories for update to authenticated
  using (public.is_menu_admin()) with check (public.is_menu_admin());

drop policy if exists "Menu admins can delete categories" on public.menu_categories;
create policy "Menu admins can delete categories"
  on public.menu_categories for delete to authenticated
  using (public.is_menu_admin());

drop policy if exists "Public can read available items" on public.menu_items;
create policy "Public can read available items"
  on public.menu_items for select to anon, authenticated
  using (available = true or public.is_menu_admin());

drop policy if exists "Menu admins can insert items" on public.menu_items;
create policy "Menu admins can insert items"
  on public.menu_items for insert to authenticated
  with check (public.is_menu_admin());

drop policy if exists "Menu admins can update items" on public.menu_items;
create policy "Menu admins can update items"
  on public.menu_items for update to authenticated
  using (public.is_menu_admin()) with check (public.is_menu_admin());

drop policy if exists "Menu admins can delete items" on public.menu_items;
create policy "Menu admins can delete items"
  on public.menu_items for delete to authenticated
  using (public.is_menu_admin());

insert into public.menu_categories (id, name_en, name_ar, position) values
  ('hot-drinks', 'Hot drinks', 'المشروبات الساخنة', 0),
  ('fresh-juices', 'Fresh juices', 'العصائر الطازجة', 1),
  ('milkshakes', 'Milkshakes', 'الميلك شيك', 2),
  ('cakes-desserts', 'Cakes & desserts', 'الكيك والحلويات', 3),
  ('cool-drinks', 'Cool drinks', 'مشروبات منعشة', 4)
on conflict (id) do nothing;

insert into public.menu_items
  (id, category_id, name_en, name_ar, description_en, description_ar, price, position, available)
values
  ('turkish-coffee', 'hot-drinks', 'Turkish coffee', 'قهوة تركية', '', '', 16, 0, true),
  ('espresso', 'hot-drinks', 'Espresso', 'إسبريسو', '', '', 15, 1, true),
  ('lemon-tea', 'hot-drinks', 'Lipton tea', 'شاي ليبتون', '', '', 13, 2, true),
  ('tea', 'hot-drinks', 'Tea', 'شاي', '', '', 10, 3, true),
  ('french-coffee', 'hot-drinks', 'French coffee', 'قهوة فرنسية', '', '', 18, 4, true),
  ('american-coffee', 'hot-drinks', 'American coffee', 'قهوة أمريكية', '', '', 18, 5, true),
  ('cappuccino', 'hot-drinks', 'Cappuccino', 'كابتشينو', '', '', 22, 6, true),
  ('nescafe', 'hot-drinks', 'Nescafé', 'نسكافيه', '', '', 20, 7, true),
  ('latte', 'hot-drinks', 'Latte', 'لاتيه', '', '', 24, 8, true),
  ('mocha', 'hot-drinks', 'Café mocha', 'كافي موكا', '', '', 24, 9, true),
  ('hot-chocolate', 'hot-drinks', 'Hot chocolate', 'هوت شوكليت', '', '', 25, 10, true),
  ('ginger-honey-lemon', 'hot-drinks', 'Honey, lemon & ginger', 'عسل ليمون زنجبيل', '', '', 15, 11, true),
  ('orange-juice', 'fresh-juices', 'Orange', 'برتقال', '', '', 18, 0, true),
  ('strawberry-juice', 'fresh-juices', 'Strawberry juice', 'عصير فراولة', '', '', 18, 1, true),
  ('flavored-juice', 'fresh-juices', 'Flavored juice', 'عصير منكه', '', '', 18, 2, true),
  ('grapefruit-juice', 'fresh-juices', 'Grapefruit', 'كريب فروت', '', '', 16, 3, true),
  ('lemon-mint', 'fresh-juices', 'Lemon & mint', 'ليمون نعناع', '', '', 16, 4, true),
  ('guava-orange', 'fresh-juices', 'Guava & orange', 'جوافة برتقال', '', '', 20, 5, true),
  ('mixed-juice', 'fresh-juices', 'Mixed juice', 'نص نص مشكل', '', '', 25, 6, true),
  ('pistachio-shake', 'milkshakes', 'Pistachio milkshake', 'ميلك شيك بيستاشيو', '', '', 28, 0, true),
  ('strawberry-shake', 'milkshakes', 'Strawberry milkshake', 'ميلك شيك فراولة', '', '', 23, 1, true),
  ('mango-shake', 'milkshakes', 'Mango milkshake', 'ميلك شيك منكه', '', '', 24, 2, true),
  ('lotus-shake', 'milkshakes', 'Lotus milkshake', 'ميلك شيك لوتس', '', '', 26, 3, true),
  ('oreo-shake', 'milkshakes', 'Oreo milkshake', 'ميلك شيك أوريو', '', '', 25, 4, true),
  ('kitkat-shake', 'milkshakes', 'KitKat chocolate milkshake', 'ميلك شيك كيت كات شوكولاتة', '', '', 28, 5, true),
  ('chocolate-cake', 'cakes-desserts', 'Chocolate cake', 'شوكولاتة كيك', '', '', 25, 0, true),
  ('ice-cake', 'cakes-desserts', 'Ice cake', 'آيس كيك', '', '', 28, 1, true),
  ('mojito', 'cool-drinks', 'Mojito', 'موهيتو', '', '', 16, 0, true),
  ('fresh-mix', 'cool-drinks', 'Fresh mix', 'منعش فريش', '', '', 20, 1, true),
  ('hawaiian-mix', 'cool-drinks', 'Hawaiian mix', 'ميكس هواي', '', '', 20, 2, true),
  ('energy-drink', 'cool-drinks', 'Baba energy drink', 'بابا انرجي درنك', '', '', 21, 3, true)
on conflict (id) do nothing;
