import { Metrics, ScheduleEntry } from "./types"
import { toMinutes } from "./time"

export function computeMetrics(schedule: ScheduleEntry[]): Metrics {
	// No planned analyses -> empty metrics
	if (schedule.length === 0) {
		return {
			totalTime: 0,
			efficiency: 0,
			conflicts: 0,
		}
	}

	let firstStart = Infinity
	let lastEnd = -Infinity
	let totalAnalysisTime = 0

	for (const entry of schedule) {
		const start = toMinutes(entry.startTime)
		const end = toMinutes(entry.endTime)

		if (end < start) {
			throw new Error(`Invalid schedule entry: endTime (${entry.endTime}) is before startTime (${entry.startTime}) for sample ${entry.sampleId}`)
		}

		const duration = end - start
		totalAnalysisTime += duration

		if (start < firstStart) firstStart = start
		if (end > lastEnd) lastEnd = end
	}

	const totalTime = lastEnd - firstStart

	// Avoid division by zero in degenerate cases (should not happen if schedule has valid durations)
	const efficiency = totalTime > 0 ? (totalAnalysisTime / totalTime) * 100 : 0

	return {
		totalTime,
		efficiency: Math.round(efficiency * 10) / 10,
		// Conflicts are handled by the scheduling logic, not recalculated here.
		conflicts: 0,
	}
}
