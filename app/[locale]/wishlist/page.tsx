import { DashboardLayout } from "@/components/dashboard-layout"
import { WishlistBoard } from "@/components/wishlist/wishlist-board"
import { getWishlistProjects } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function WishlistPage() {
  const wishlistProjects = await getWishlistProjects()
  const t = await getTranslations("Wishlist")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <WishlistBoard wishlistProjects={wishlistProjects} />
    </DashboardLayout>
  )
}
