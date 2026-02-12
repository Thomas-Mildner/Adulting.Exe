const ICAL = require("ical.js");

const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Example Corp//Example Client//EN
BEGIN:VEVENT
UID:1234567890
DTSTAMP:20250101T000000Z
DTSTART;VALUE=DATE:20260215
SUMMARY:Restmüll Abholung
END:VEVENT
BEGIN:VEVENT
UID:0987654321
DTSTAMP:20250101T000000Z
DTSTART;VALUE=DATE:20260220
SUMMARY:Bio Tonne
END:VEVENT
END:VCALENDAR`;

try {
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    console.log(`Found ${vevents.length} events`);

    for (const vevent of vevents) {
        const event = new ICAL.Event(vevent);
        const summary = event.summary;
        const startDate = event.startDate ? event.startDate.toJSDate() : null;

        console.log("Event:", {
            summary,
            startDate: startDate ? startDate.toISOString() : "null"
        });
    }
} catch (error) {
    console.error("Error parsing:", error);
}
