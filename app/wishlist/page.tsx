"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { WishlistBoard } from "@/components/wishlist/wishlist-board"

export default function WishlistPage() {
  return (
    <DashboardLayout
      title="Die Wunschliste"
      subtitle="Traeume, Illusionen und ueberraschend teure Zaeune."
    >
      <WishlistBoard />
    </DashboardLayout>
  )
}
