/**
 * Convert "HH:MM" to minutes since 00:00.
 * Example: "09:30" -> 570
 */

export function toMinutes(hhmm: string): number {
	const match = /^(\d{2}):(\d{2})$/.exec(hhmm)
	if (!match) {
		throw new Error(`Invalid time format "${hhmm}". Expected "HH:MM".`)
	}

	const hours = Number(match[1])
	const minutes = Number(match[2])

	if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
		throw new Error(`Invalid time numbers in "${hhmm}".`)
	}
	if (hours < 0 || hours > 23) {
		throw new Error(`Invalid hours in "${hhmm}". Must be 00-23.`)
	}
	if (minutes < 0 || minutes > 59) {
		throw new Error(`Invalid minutes in "${hhmm}". Must be 00-59.`)
	}

	return hours * 60 + minutes
}

/**
 * Convert minutes since 00:00 to "HH:MM".
 * Example: 570 -> "09:30"
 */

export function toHHMM(totalMinutes: number): string {
	if (!Number.isFinite(totalMinutes)) {
		throw new Error(`Invalid minutes value "${totalMinutes}".`)
	}

	const minutes = Math.trunc(totalMinutes)
	if (minutes < 0) {
		throw new Error(`Minutes cannot be negative: ${minutes}`)
	}

	const hh = Math.floor(minutes / 60)
	const mm = minutes % 60

	// Version SIMPLE: the planning is limited to a single day.
	// If we exceed 23:59, the computed time is outside the scope of the SIMPLE version.
	if (hh > 23) {
		throw new Error(`Time overflow: ${minutes} minutes -> ${hh}:${mm}.`)
	}

	return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
}
