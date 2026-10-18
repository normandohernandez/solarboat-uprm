// Event selection, scheduling, cooldown, and presentation rules.
// Kept separate from the popup DOM so future homepage sections can reuse it.
(function (root) {
  'use strict';

  const DEFAULT_TIME_ZONE = 'America/Puerto_Rico';
  const DISMISSAL_COOLDOWN_MS = 14400000;
  const SUPPORTED_TYPES = ['raffle', 'competition', 'activity', 'announcement', 'fundraising'];
  const TYPE_LABELS = {
    raffle: 'Raffle',
    competition: 'Competition',
    activity: 'Activity',
    announcement: 'Announcement',
    fundraising: 'Fundraising'
  };

  const hasValue = value => value !== undefined && value !== null && String(value).trim() !== '';

  const partsInTimeZone = (date, timeZone) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hourCycle: 'h23'
    });
    return formatter.formatToParts(date).reduce((parts, part) => {
      if (part.type !== 'literal') parts[part.type] = Number(part.value);
      return parts;
    }, {});
  };

  // Converts a date/time without an offset into the requested IANA timezone.
  const zonedTimeToUtc = (values, timeZone) => {
    const requestedUtc = Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute, values.second, values.millisecond);
    let result = requestedUtc;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const actual = partsInTimeZone(new Date(result), timeZone);
      const representedUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, actual.second, values.millisecond);
      result += requestedUtc - representedUtc;
    }
    return result;
  };

  const parseScheduleDate = (value, options) => {
    if (!hasValue(value)) return null;
    const text = String(value).trim();
    const settings = options || {};

    // Explicit ISO offsets always take precedence over the event timezone.
    if (/T.*(?:Z|[+-]\d{2}:?\d{2})$/i.test(text)) {
      const timestamp = Date.parse(text);
      return Number.isNaN(timestamp) ? NaN : timestamp;
    }

    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/);
    if (!match) return NaN;

    const dateOnly = !match[4];
    const endOfDay = Boolean(settings.endOfDay && dateOnly);
    const values = {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: endOfDay ? 23 : Number(match[4] || 0),
      minute: endOfDay ? 59 : Number(match[5] || 0),
      second: endOfDay ? 59 : Number(match[6] || 0),
      millisecond: endOfDay ? 999 : Number(String(match[7] || '0').padEnd(3, '0'))
    };

    try {
      const timestamp = zonedTimeToUtc(values, settings.timeZone || DEFAULT_TIME_ZONE);
      const check = partsInTimeZone(new Date(timestamp), settings.timeZone || DEFAULT_TIME_ZONE);
      if (check.year !== values.year || check.month !== values.month || check.day !== values.day) return NaN;
      return timestamp;
    } catch (error) {
      return NaN;
    }
  };

  const isEligible = (event, at) => {
    if (!event || !event.active || !hasValue(event.id) || !SUPPORTED_TYPES.includes(event.type)) return false;
    const now = at === undefined ? Date.now() : Number(at);
    const timeZone = event.timeZone || DEFAULT_TIME_ZONE;
    const start = parseScheduleDate(event.displayStart, { timeZone, endOfDay: false });
    const end = parseScheduleDate(event.displayEnd, { timeZone, endOfDay: true });
    if ((hasValue(event.displayStart) && Number.isNaN(start)) || (hasValue(event.displayEnd) && Number.isNaN(end))) return false;
    return (start === null || now >= start) && (end === null || now <= end);
  };

  const storageKeyFor = event => {
    const version = hasValue(event.version) ? event.version : 1;
    return `solarBoatEventPopupDismissedAt:${encodeURIComponent(event.id)}:v${encodeURIComponent(version)}`;
  };

  const isCoolingDown = (event, at, storage) => {
    if (!storage) return false;
    try {
      const dismissedAt = Number(storage.getItem(storageKeyFor(event)));
      const elapsed = (at === undefined ? Date.now() : Number(at)) - dismissedAt;
      return dismissedAt > 0 && elapsed >= 0 && elapsed < DISMISSAL_COOLDOWN_MS;
    } catch (error) {
      return false;
    }
  };

  const compareEvents = (left, right) => {
    const leftPriority = Number.isFinite(Number(left.priority)) ? Number(left.priority) : Number.MAX_SAFE_INTEGER;
    const rightPriority = Number.isFinite(Number(right.priority)) ? Number(right.priority) : Number.MAX_SAFE_INTEGER;
    return leftPriority - rightPriority || String(left.id).localeCompare(String(right.id));
  };

  const getEligibleEvents = (events, options) => {
    const settings = options || {};
    const at = settings.at === undefined ? Date.now() : Number(settings.at);
    let storage = settings.storage;
    if (storage === undefined) {
      try { storage = root.localStorage; } catch (error) { storage = null; }
    }
    return (Array.isArray(events) ? events : [])
      .filter(event => isEligible(event, at))
      .filter(event => !settings.respectCooldown || !isCoolingDown(event, at, storage))
      .sort(compareEvents);
  };

  const selectEvent = (events, options) => getEligibleEvents(events, options)[0] || null;

  const dismiss = (event, storage, at) => {
    if (!event || !storage) return;
    try { storage.setItem(storageKeyFor(event), String(at === undefined ? Date.now() : Number(at))); } catch (error) { /* no-op */ }
  };

  const detail = (label, value) => hasValue(value) ? { label, value: String(value) } : null;

  const getDetails = event => {
    const rules = {
      raffle: [detail('Prize', event.prize), detail('Ticket Price', event.ticketPrice), detail('Raffle Date', event.raffleDate)],
      competition: [detail('Event Date', event.eventDate), detail('Location', event.location)],
      activity: [detail('Event Date', event.eventDate), detail('Location', event.location)],
      announcement: [detail('Event Date', event.eventDate), detail('Location', event.location)],
      fundraising: [detail('Event Date', event.eventDate), detail('Location', event.location)]
    };
    return (rules[event.type] || []).filter(Boolean);
  };

  const getCategory = event => hasValue(event.category) ? String(event.category) : TYPE_LABELS[event.type];

  const isValidActionUrl = (value, baseUrl) => {
    if (!hasValue(value) || String(value).trim() === '#') return false;
    try {
      const url = new URL(String(value).trim(), baseUrl || root.location.href);
      return ['http:', 'https:', 'mailto:', 'tel:', 'file:'].includes(url.protocol);
    } catch (error) {
      return false;
    }
  };

  root.SolarBoatEventSystem = {
    DEFAULT_TIME_ZONE,
    DISMISSAL_COOLDOWN_MS,
    SUPPORTED_TYPES,
    parseScheduleDate,
    isEligible,
    storageKeyFor,
    isCoolingDown,
    getEligibleEvents,
    selectEvent,
    dismiss,
    getDetails,
    getCategory,
    isValidActionUrl
  };
})(typeof window !== 'undefined' ? window : globalThis);
