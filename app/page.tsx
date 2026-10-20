import MenuExperience from "@/components/menu-experience";
import { getMenuData } from "@/lib/menu";

export const dynamic = "force-dynamic";

export default async function Home() {
  let menu: Awaited<ReturnType<typeof getMenuData>> | null = null;
  let loadError = false;
  try {
    menu = await getMenuData();
  } catch (error) {
    console.error("Menu data load failed:", error);
    loadError = true;
  }
  return (
    <MenuExperience
      categories={menu?.categories ?? []}
      items={menu?.items ?? []}
      loadError={loadError}
    />
  );
}
