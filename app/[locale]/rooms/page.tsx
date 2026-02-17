import { DashboardLayout } from "@/components/dashboard-layout"
import { RoomList } from "@/components/rooms/room-list"
import { getTranslations } from "next-intl/server"
import { getRooms } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function RoomsPage() {
  const rooms = await getRooms()
  const t = await getTranslations("Rooms")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <RoomList rooms={rooms} />
    </DashboardLayout>
  )
}
