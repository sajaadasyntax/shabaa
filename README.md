# Shahbaa Café QR menu

An Arabic/English Next.js QR menu with a Supabase-backed admin panel at `/admin`.
The public menu opens directly on the menu; Arabic is selected by default.

## Run locally

```sh
npm install
npm run dev
```

Without Supabase environment variables, the public page uses the editable starter
menu in `lib/menu.ts`. Admin sign-in and shared editing require Supabase.

## Configure shared menu and admin access

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` to the **Project URL** and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the publishable/anon key from the
   project API settings. The URL should look like
   `https://<project-ref>.supabase.co`, not a `supabase.com/dashboard/...` link.
   The publishable/anon key is intended for browser use;
   do not put a service-role key in the frontend.
3. Run `supabase/schema.sql` in the Supabase SQL Editor. It creates and seeds
   the menu, configures row-level security, and adds the admin allowlist.
4. Create the administrator as a user in Supabase Authentication (keep public
   sign-ups disabled). In the SQL Editor, grant that user access by replacing
   the UUID below with their Auth user ID:

   ```sql
   insert into public.menu_admins (user_id)
   values ('00000000-0000-0000-0000-000000000000');
   ```

5. Restart the Next.js server. Sign in at `/admin` with that account. Price,
   item, availability, and category edits are shared with all menu visitors.

The starter entries and prices are transcribed from the supplied menu photo
and may contain spelling or reading errors. They can be corrected in the
English/Arabic item fields in the admin panel. Each item also supports its own
image URL; when that field is empty, the menu shows a category-matched starter
photo.
