# Room Chronicles - Testing Guide

## Prerequisites

Before testing the Room Chronicles feature, ensure you have:

1. **Docker** installed and running
2. **Node.js** >= 18 installed
3. **npm** or **pnpm** installed

## Setup Instructions

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
# or
pnpm install
```

### 2. Start the Database

```bash
docker compose up -d
```

This starts PostgreSQL on port 5432.

### 3. Configure Environment

The `.env` file should already exist with:
```
DATABASE_URL="postgresql://adulting:adulting_secret@localhost:5432/adulting_exe?schema=public"
```

### 4. Push Database Schema

```bash
npm run db:push
# or
pnpm db:push
```

This creates the `Room` and `RoomEvent` tables in the database.

### 5. Seed Sample Data

```bash
npm run db:seed
# or
pnpm db:seed
```

This creates:
- 5 sample rooms (Living Room, Kitchen, Master Bedroom, Bathroom, Home Office)
- 2-3 events per room showcasing different categories
- Paint/flooring events with metadata for the swatch library

### 6. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing Checklist

### Navigation

- [ ] Click on "Room Chronicles" / "Raum-Chronik" in the sidebar
- [ ] Verify the page loads with the title "Room Chronicles" and subtitle "Every wall has a story. Usually an expensive one."
- [ ] Check that the navigation item is highlighted when on the rooms page

### Room List View (`/rooms`)

#### Empty State
- [ ] Delete all rooms (if any exist)
- [ ] Verify empty state message: "No rooms yet. Add your first room to start tracking its history."

#### Create Room
- [ ] Click "Add Room" button
- [ ] Fill in the form:
  - Name: "Test Room"
  - Type: Select "Kitchen"
  - Floor: Select "Ground Floor"
  - Description: "Test description"
- [ ] Click "Create Room"
- [ ] Verify room appears in the grid
- [ ] Verify room shows "0 Total Events"

#### View Room Details
- [ ] Verify each room card shows:
  - Room name
  - Room type and floor
  - Description (if provided)
  - Event count
  - Edit and Delete buttons
  - "Timeline" button

#### Edit Room
- [ ] Click the edit (pencil) icon on a room
- [ ] Modify the room name
- [ ] Click "Update Room"
- [ ] Verify changes are reflected

#### Delete Room
- [ ] Click the delete (trash) icon on a room
- [ ] Confirm the deletion dialog
- [ ] Verify room is removed from the list

### Room Timeline View (`/rooms/[id]`)

#### Statistics Cards
- [ ] Navigate to a room's timeline by clicking "Timeline" button
- [ ] Verify the stats cards show:
  - Total Events count
  - Maintenance count
  - Incidents count
  - Last Update date

#### Empty Timeline
- [ ] For a room with no events, verify empty state: "No events yet. Start logging this room's history!"

#### Create Event - Aesthetics (Paint)
- [ ] Click "Log Event" button
- [ ] Fill in the form:
  - Date & Time: Select current date/time
  - Category: "Aesthetics"
  - Description: "Painted wall in Ocean Blue"
  - Brand: "Sherwin Williams"
  - Finish: "Matte"
  - Color Code: "#0077BE"
  - Vibe Rating: 5 stars
- [ ] Click "Create Event"
- [ ] Verify event appears in timeline with:
  - Category badge
  - Date/time
  - Star rating (5 yellow stars)
  - Description
  - Metadata tags showing brand, finish, and color code

#### Create Event - Maintenance (Bulb)
- [ ] Click "Log Event" button
- [ ] Fill in the form:
  - Category: "Maintenance"
  - Description: "Changed ceiling bulb"
  - Bulb Type: "E27, 4000K, 800 lumen"
  - Vibe Rating: 3 stars
- [ ] Verify bulb type metadata appears

#### Create Event - Incident
- [ ] Create an incident event with category "Incident"
- [ ] Verify it appears with the AlertTriangle icon
- [ ] Check that the incidents counter increased in stats

#### Swatch Library
- [ ] Create 2-3 paint/flooring events (Aesthetics category) with color codes
- [ ] Verify the "Swatch Library" card appears above the timeline
- [ ] Check that it shows the 3 most recent paint events
- [ ] Verify each swatch shows:
  - Color preview square with the correct color
  - Brand name
  - Color code
  - Finish type

#### Edit Event
- [ ] Click the edit (pencil) icon on an event
- [ ] Modify the description
- [ ] Change the vibe rating
- [ ] Click "Update Event"
- [ ] Verify changes are reflected

#### Delete Event
- [ ] Click the delete (trash) icon on an event
- [ ] Confirm deletion
- [ ] Verify event is removed from timeline
- [ ] Check that stats are updated

### Event Categories

Test creating events for each category and verify the correct icon appears:
- [ ] Maintenance → Wrench icon
- [ ] Aesthetics → Paintbrush icon
- [ ] Incident → AlertTriangle icon
- [ ] Tech → Cpu icon
- [ ] Surgery → Hammer icon
- [ ] Band-aid → Bandage icon
- [ ] Face-lift → Sparkles icon

### Metadata Fields

Verify that different categories show appropriate metadata fields:

- [ ] **Aesthetics**: Brand, Finish, Color Code
- [ ] **Maintenance**: Bulb Type, Battery Type
- [ ] **Other categories**: Notes field

### Translations

Switch language in settings and verify:
- [ ] Navigation item translates (EN: "Room Chronicles", DE: "Raum-Chronik")
- [ ] Page titles translate correctly
- [ ] All form labels translate
- [ ] Room types translate (Kitchen → Küche, etc.)
- [ ] Floor levels translate (Ground Floor → Erdgeschoss, etc.)
- [ ] Category names translate

### Responsive Design

Test on different screen sizes:
- [ ] Desktop: Room grid shows 3 columns
- [ ] Tablet: Room grid shows 2 columns
- [ ] Mobile: Room grid shows 1 column
- [ ] Timeline displays correctly on mobile
- [ ] Forms are usable on mobile

### Edge Cases

- [ ] Create a room with very long name (test text truncation)
- [ ] Create an event with very long description (test line breaks)
- [ ] Create multiple events on the same day (test sorting)
- [ ] Test with no metadata (verify it still renders correctly)
- [ ] Test with no vibe rating (verify stars don't show)

## Known Limitations

1. **Photo Attachments**: Not yet implemented (attachments field exists in database but UI not built)
2. **Global Search**: Search functionality mentioned in requirements but not yet implemented in UI
3. **QR Codes**: QR code generation for rooms not implemented
4. **Quick Log Buttons**: Pre-filled quick log buttons not implemented

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
```bash
docker compose down
docker compose up -d
npm run db:push
npm run db:seed
```

### Build Errors

If you encounter Google Fonts errors during build, this is expected in restricted networks. The app will work in development mode.

### Type Errors

If you see TypeScript errors, regenerate Prisma client:
```bash
npm run db:generate
```

## Success Criteria

The feature is working correctly if you can:

1. ✅ Create, read, update, and delete rooms
2. ✅ Create, read, update, and delete room events
3. ✅ See events displayed in reverse chronological order
4. ✅ See the swatch library with recent paint colors
5. ✅ See statistics update correctly
6. ✅ See metadata displayed based on event category
7. ✅ Rate events with vibe ratings (1-5 stars)
8. ✅ Switch between languages and see translations

## Sample Data

After seeding, you should have:

- **Living Room** (Ground Floor): 3 events including paint, bulb change, smart switch
- **Kitchen** (Ground Floor): 3 events including coffee incident, duct tape fix, faucet replacement
- **Master Bedroom** (1st Floor): 2 events including Forest Green accent wall, smoke detector battery
- **Bathroom** (Ground Floor): 2 events including vanity mirror installation, bathtub re-caulking  
- **Home Office** (1st Floor): 2 events including Agreeable Gray paint, smart thermostat

Each room demonstrates different event categories, metadata types, and vibe ratings.
