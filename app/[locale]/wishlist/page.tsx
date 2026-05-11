import { DashboardLayout } from "@/components/dashboard-layout"
import { WishlistBoard } from "@/components/wishlist/wishlist-board"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getWishlistProjects, getAppConfig } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function WishlistPage() {
  const [wishlistProjects, appConfig, t] = await Promise.all([
    getWishlistProjects(),
    getAppConfig(),
    getTranslations("Wishlist"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="wishlist"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("wishlist")}
      />
      <WishlistBoard wishlistProjects={wishlistProjects} />
    </DashboardLayout>
  )
}
