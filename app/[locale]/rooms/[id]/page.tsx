import { DashboardLayout } from "@/components/dashboard-layout"
import { RoomTimeline } from "@/components/rooms/room-timeline"
import { getTranslations } from "next-intl/server"
import { getRoom, getRoomEvents } from "@/lib/actions"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const room = await getRoom(id)
  
  if (!room) {
    notFound()
  }

  const events = await getRoomEvents(id)
  const t = await getTranslations("Rooms")

  return (
    <DashboardLayout
      title={room.name}
      subtitle={`${t(`roomTypes.${room.type}`)}${room.floor ? ` · ${t(`floors.${room.floor}`)}` : ""}`}
    >
      <RoomTimeline room={room} events={events} />
    </DashboardLayout>
  )
}
