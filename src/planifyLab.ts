import { computeMetrics } from "./metrics"
import { toHHMM, toMinutes } from "./time"
import type { Equipment, Input, Output, Sample, ScheduleEntry, Technician } from "./types"

function priorityRank(p: Sample["priority"]): number {
	// Lower is higher priority STAT > URGENT > ROUTINE
	switch (p) {
		case "STAT":
			return 0
		case "URGENT":
			return 1
		case "ROUTINE":
			return 2
	}
}

function isTechnicianCompatible(tech: Technician, sample: Sample): boolean {
	return tech.speciality === sample.type || tech.speciality === "GENERAL"
}

function isEquipmentCompatible(eq: Equipment, sample: Sample): boolean {
	return eq.type === sample.type && eq.available === true
}

function getNextFree(map: Map<string, number>, id: string): number {
	return map.get(id) ?? 0
}

function setNextFree(map: Map<string, number>, id: string, value: number): void {
	map.set(id, value)
}

function pickTechniciansOrdered(technicians: Technician[], sample: Sample): Technician[] {
	// Prefer exact specialty match over GENERAL (helps match expected outputs)
	const exact: Technician[] = []
	const general: Technician[] = []

	for (const t of technicians) {
		if (!isTechnicianCompatible(t, sample)) continue
		if (t.speciality === sample.type) exact.push(t)
		else general.push(t)
	}

	return [...exact, ...general]
}

function pickEquipmentsOrdered(equipment: Equipment[], sample: Sample): Equipment[] {
	// Only those that match type + available=true
	return equipment.filter((e) => isEquipmentCompatible(e, sample))
}

export function planifyLab(data: Input): Output {
	// Sort samples by priority then arrivalTime, stable on original order
	const samplesWithIndex = data.samples.map((s, idx) => ({ s, idx }))
	samplesWithIndex.sort((a, b) => {
		const pr = priorityRank(a.s.priority) - priorityRank(b.s.priority)
		if (pr !== 0) return pr

		const at = toMinutes(a.s.arrivalTime) - toMinutes(b.s.arrivalTime)
		if (at !== 0) return at

		return a.idx - b.idx
	})

	const techNextFree = new Map<string, number>()
	const eqNextFree = new Map<string, number>()

	const schedule: ScheduleEntry[] = []

	for (const { s: sample } of samplesWithIndex) {
		// Find compatible equipment (type + available)
		const compatibleEquipments = pickEquipmentsOrdered(data.equipment, sample)
		if (compatibleEquipments.length === 0) {
			throw new Error(`No available equipment found for sample ${sample.id} (type=${sample.type})`)
		}

		// Find compatible technicians (speciality match first, then GENERAL)
		const compatibleTechnicians = pickTechniciansOrdered(data.technicians, sample)
		if (compatibleTechnicians.length === 0) {
			throw new Error(`No compatible technician found for sample ${sample.id} (type=${sample.type})`)
		}

		// Choose the best (tech, equipment) pair by earliest feasible start time
		const arrival = toMinutes(sample.arrivalTime)
		const statDeadline = arrival + 60

		let bestStart: number | null = null
		let bestEnd: number | null = null
		let bestTech: Technician | null = null
		let bestEq: Equipment | null = null

		for (const tech of compatibleTechnicians) {
			const techStart = toMinutes(tech.startTime)
			const techEnd = toMinutes(tech.endTime)
			const techFree = getNextFree(techNextFree, tech.id)

			for (const eq of compatibleEquipments) {
				const eqFree = getNextFree(eqNextFree, eq.id)

				const start = Math.max(arrival, techStart, techFree, eqFree)
				const end = start + sample.analysisTime

				// Must fit within technician working hours in SIMPLE version
				if (end > techEnd) {
					continue
				}

				if (sample.priority === "STAT" && end > statDeadline) {
					continue
				}

				if (bestStart === null || start < bestStart || (start === bestStart && end < (bestEnd ?? end))) {
					bestStart = start
					bestEnd = end
					bestTech = tech
					bestEq = eq
				}
			}
		}

		// No feasible pair found
		if (bestStart === null || bestEnd === null || bestTech === null || bestEq === null) {
			if (sample.priority === "STAT") {
				throw new Error(`Cannot schedule STAT sample ${sample.id} within 60 minutes of arrival`)
			}
			throw new Error(`Cannot schedule sample ${sample.id} within technician working hours`)
		}

		// Block resources
		setNextFree(techNextFree, bestTech.id, bestEnd)
		setNextFree(eqNextFree, bestEq.id, bestEnd)

		schedule.push({
			sampleId: sample.id,
			technicianId: bestTech.id,
			equipmentId: bestEq.id,
			startTime: toHHMM(bestStart),
			endTime: toHHMM(bestEnd),
			priority: sample.priority,
		})
	}

	// Ensure schedule is chronological
	schedule.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))

	// Metrics
	const metrics = computeMetrics(schedule)

	return { schedule, metrics }
}
