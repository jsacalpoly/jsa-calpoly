/** Helpers for the Forecast calendar: presets, repeating events and the Wednesday-to-Tuesday week. */

export const presetIds = [
  "gen-meeting",
  "fishbowl",
  "volleyball",
  "weekend-event",
  "special-event",
  "matcha-run",
  "cookbook",
  "jseigakan",
] as const;

export type PresetId = (typeof presetIds)[number];

/** Each preset has its own line-drawn doodle (24 x 24). The colors and borders live in EventCard.astro. */
export const doodles: Record<PresetId, string> = {
  "gen-meeting": "M4 19 C3 9 21 9 20 19 Z M12 19 L12 10 M8 19 L8.5 11.5 M16 19 L15.5 11.5",
  fishbowl: "M3 12 C7 5 15 5 18 12 C15 19 7 19 3 12 Z M18 12 L22 7 M18 12 L22 17 M7.5 11 L8 11.2",
  volleyball:
    "M12 3 C17 3 21 7 21 12 C21 17 17 21 12 21 C7 21 3 17 3 12 C3 7 7 3 12 3 Z M3 12 C8 10 16 10 21 12 M12 3 C9 8 9 16 12 21",
  "weekend-event":
    "M12 8 C14 8 16 10 16 12 C16 14 14 16 12 16 C10 16 8 14 8 12 C8 10 10 8 12 8 Z M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12 M5 5 L7 7 M17 17 L19 19 M19 5 L17 7 M5 19 L7 17",
  "special-event": "M12 3 L14.5 9 L21 9.5 L16 14 L17.5 21 L12 17.5 L6.5 21 L8 14 L3 9.5 L9.5 9 Z",
  "matcha-run": "M3 11 L21 11 C21 17 17 21 12 21 C7 21 3 17 3 11 Z M8 7 C7 5 9 4 8 2 M13 7 C12 5 14 4 13 2",
  cookbook: "M5 4 L19 4 L19 20 L5 20 Z M9 4 L9 20 M12 9 L16 9",
  jseigakan: "M3 10 L21 10 L21 20 L3 20 Z M3 10 L5 5 L21 3 L21 10 M8 10 L10 4 M14 10 L16 4",
};

/** A calendar file as the page needs it. */
export interface CalendarEntry {
  id: string;
  title: string;
  preset: PresetId;
  date?: Date;
  endDate?: Date;
  time?: string;
  place?: string;
  repeat?: "weekly";
  until?: Date;
  featured: boolean;
}

/** One event on one day of the board. */
export interface Occurrence {
  id: string;
  title: string;
  preset: PresetId;
  time?: string;
  place?: string;
}

export interface Day {
  /** YYYY-MM-DD */
  key: string;
  name: string;
  kanji: string;
  dayOfMonth: number;
  events: Occurrence[];
}

export interface Week {
  /** The Wednesday this week starts on, YYYY-MM-DD. */
  start: string;
  /** "Nov 11 – 17" */
  label: string;
  days: Day[];
}

const DAY_MS = 86_400_000;
const WEDNESDAY = 3;
const names = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const kanji = ["日", "月", "火", "水", "木", "金", "土"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Days are plain YYYY-MM-DD strings, so time zones never move an event to another day. */
export const dayKey = (date: Date) => date.toISOString().slice(0, 10);
const toTime = (key: string) => Date.parse(`${key}T00:00:00Z`);
export const addDays = (key: string, days: number) => dayKey(new Date(toTime(key) + days * DAY_MS));
const weekdayOf = (key: string) => new Date(toTime(key)).getUTCDay();

/** Today in Pacific time, as YYYY-MM-DD. The page script uses the same rule, so build and browser always agree. */
export const todayInSlo = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(now);

/** The Wednesday that starts the week containing this day. */
export const weekStartFor = (key: string) => addDays(key, -((weekdayOf(key) - WEDNESDAY + 7) % 7));

/** Hour an event starts, to place it in its column. All day goes to the top, and "5:30 & 6:30 PM" starts at 5:30. */
export function startHour(time?: string): number {
  if (!time || /all day/i.test(time)) return 8;
  const match = time.match(/(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 12;
  let hour = Number(match[1]) % 12;
  if (/pm/i.test(time)) hour += 12;
  return hour + Number(match[2] ?? 0) / 60;
}

/** Every day an entry shows up on between two days (inclusive), as YYYY-MM-DD. */
function daysFor(entry: CalendarEntry, from: string, to: string): string[] {
  if (!entry.date) return [];
  const first = dayKey(entry.date);
  const days: string[] = [];
  if (entry.repeat === "weekly") {
    const last = entry.until ? dayKey(entry.until) : to;
    for (let key = from > first ? from : first; key <= to && key <= last; key = addDays(key, 1)) {
      if (weekdayOf(key) === weekdayOf(first)) days.push(key);
    }
    return days;
  }
  const last = entry.endDate ? dayKey(entry.endDate) : first;
  for (let key = first; key <= last; key = addDays(key, 1)) {
    if (key >= from && key <= to) days.push(key);
  }
  return days;
}

/** Wednesday-to-Tuesday weeks, starting with the week that contains `today`. */
export function buildWeeks(entries: CalendarEntry[], today: string, count: number): Week[] {
  const firstStart = weekStartFor(today);
  const lastDay = addDays(firstStart, count * 7 - 1);
  const byDay = new Map<string, Occurrence[]>();
  for (const entry of entries) {
    for (const key of daysFor(entry, firstStart, lastDay)) {
      const list = byDay.get(key) ?? [];
      list.push({ id: entry.id, title: entry.title, preset: entry.preset, time: entry.time, place: entry.place });
      byDay.set(key, list);
    }
  }
  return Array.from({ length: count }, (_, w) => {
    const start = addDays(firstStart, w * 7);
    const days = Array.from({ length: 7 }, (_, d): Day => {
      const key = addDays(start, d);
      const events = (byDay.get(key) ?? []).sort(
        (a, b) => startHour(a.time) - startHour(b.time) || a.title.localeCompare(b.title),
      );
      const weekday = weekdayOf(key);
      return { key, name: names[weekday], kanji: kanji[weekday], dayOfMonth: Number(key.slice(8)), events };
    });
    const [first, last] = [days[0], days[6]];
    const monthOf = (key: string) => months[Number(key.slice(5, 7)) - 1];
    const label = `${monthOf(first.key)} ${first.dayOfMonth} – ${
      monthOf(first.key) === monthOf(last.key) ? "" : `${monthOf(last.key)} `
    }${last.dayOfMonth}`;
    return { start, label, days };
  });
}

/** A long time such as "6:30 – 8:30 PM" is tight on a narrow card, so close up the spaces around the dash. */
export const tightTime = (time: string) => (time.length > 12 ? time.replace(/\s*–\s*/, "–") : time);

/** Big events for the "Coming up" tickets: featured ones that have not passed, dated first and "date TBD" last. */
export function comingUp(entries: CalendarEntry[], today: string) {
  return entries
    .filter((entry) => entry.featured)
    .filter((entry) => !entry.date || dayKey(entry.endDate ?? entry.date) >= today)
    .sort((a, b) => (a.date?.getTime() ?? Infinity) - (b.date?.getTime() ?? Infinity))
    .slice(0, 3);
}

/** One event in the list the /links ticket picks from. */
export interface UpcomingEvent {
  /** YYYY-MM-DD */
  key: string;
  title: string;
  preset: PresetId;
  time?: string;
  place?: string;
  /** Hour it starts, 0-24, so the page can tell whether it already began today. */
  hour: number;
}

/** The next few events in date order, for the /links ticket. The page script drops any that have already started. */
export function upcoming(entries: CalendarEntry[], today: string, count = 8): UpcomingEvent[] {
  return buildWeeks(entries, today, 26)
    .flatMap((week) => week.days)
    .flatMap((day) => day.events.map((event) => ({ day, event })))
    .filter(({ day }) => day.key >= today)
    .slice(0, count)
    .map(({ day, event }) => ({
      key: day.key,
      title: event.title,
      preset: event.preset,
      time: event.time,
      place: event.place,
      hour: startHour(event.time),
    }));
}

/** The first event that has not started yet. `hour` is the current hour in Pacific time. A short grace keeps a meeting
 *  on the ticket while it is still going on. */
export function pickNext(list: UpcomingEvent[], today: string, hour: number) {
  const GRACE = 2;
  return list.find((event) => event.key > today || (event.key === today && event.hour + GRACE > hour));
}

/** "Wednesday" for a YYYY-MM-DD key. */
export const weekdayOfKey = (key: string) => weekdays[new Date(toTime(key)).getUTCDay()];

export const monthName = (date: Date) => months[date.getUTCMonth()].toUpperCase();
export const weekdayName = (date: Date) => weekdays[date.getUTCDay()];

// ---------- Board layout ----------

const COLUMN_BASE = 420; // height of a day column on desktop
const CARD_HEIGHT = 128; // a card is about this tall, used to keep two events on one day from overlapping
const CARD_TOP = 18; // the earliest an event sits in its column
const KANJI_ZONE = 100; // room left at the bottom of the column for the weekday kanji
const STACK_GAP = 10;
const PHONE_EVENT_HEIGHT = 170; // phone timeline: height of a day with one event
const PHONE_QUIET_HEIGHT = 92; // and of a day with nothing planned
const PHONE_WIDTH = 326; // the dotted line is drawn in this width and stretches to fit
const PILL_HALF = 26;

const tilts = [-1.2, 0.8, -0.6, 1.1, -0.9, 0.7, -1];
const hash = (text: string) => [...text].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 7);

export interface Slot {
  event: Occurrence;
  /** Distance from the top of the day column on desktop, so earlier events sit higher. */
  top: number;
  tilt: number;
  wobble: number;
}

export interface DayLayout {
  day: Day;
  slots: Slot[];
  phoneHeight: number;
}

/** Where everything goes for one week: card heights by time on desktop, and the loopy dotted line on phones. */
export function layoutWeek(week: Week) {
  const range = COLUMN_BASE - KANJI_ZONE - CARD_HEIGHT - CARD_TOP;
  let columnHeight = COLUMN_BASE;
  const days: DayLayout[] = week.days.map((day) => {
    let previousBottom = -Infinity;
    const slots = day.events.map((event): Slot => {
      const fraction = Math.min(1, Math.max(0, (startHour(event.time) - 8) / 13));
      const top = Math.max(CARD_TOP + fraction * range, previousBottom + STACK_GAP);
      previousBottom = top + CARD_HEIGHT;
      columnHeight = Math.max(columnHeight, previousBottom + KANJI_ZONE);
      const h = hash(`${event.id}${day.key}`);
      return { event, top: Math.round(top), tilt: tilts[h % tilts.length], wobble: (h >> 4) % 3 };
    });
    const phoneHeight = day.events.length === 0 ? PHONE_QUIET_HEIGHT : day.events.length * PHONE_EVENT_HEIGHT;
    return { day, slots, phoneHeight };
  });

  // The dotted line runs through the middle of every day, wavering left and right, with a loop now and then.
  const centers: number[] = [];
  let y = 0;
  for (const { phoneHeight } of days) {
    centers.push(y + phoneHeight / 2);
    y += phoneHeight;
  }
  const middle = PHONE_WIDTH / 2;
  let thread = `M ${middle} ${centers[0] + PILL_HALF}`;
  for (let i = 1; i < centers.length; i++) {
    const from = centers[i - 1] + PILL_HALF;
    const to = centers[i] - PILL_HALF;
    const length = to - from;
    const side = i % 2 ? 1 : -1;
    const loop = i === 3 || i === 5;
    const bend = loop ? 100 : 36;
    const [a, b] = loop ? [0.98, 0.02] : [0.35, 0.65];
    thread += ` C ${middle + side * bend} ${from + length * a} ${middle - side * bend} ${from + length * b} ${middle} ${to}`;
  }
  return { columnHeight, days, phoneHeight: y, thread };
}

/** Which look a big event's ticket gets. */
export const ticketLook = (preset: PresetId): "maroon" | "kraft" | "coral" =>
  preset === "special-event" ? "maroon" : preset === "cookbook" || preset === "matcha-run" ? "kraft" : "coral";
