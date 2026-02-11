import { DashboardLayout } from "@/components/dashboard-layout"
import { WishlistBoard } from "@/components/wishlist/wishlist-board"
import { getWishlistProjects } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function WishlistPage() {
  const wishlistProjects = await getWishlistProjects()

  return (
    <DashboardLayout
      title="Die Wunschliste"
      subtitle="Träume, Illusionen und überraschend teure Zäune."
    >
      <WishlistBoard wishlistProjects={wishlistProjects} />
    </DashboardLayout>
  )
}
