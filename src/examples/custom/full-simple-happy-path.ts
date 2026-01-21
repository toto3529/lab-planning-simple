export const name = "Custom — Full SIMPLE happy path (priorities, parallelism, STAT < 60, no conflicts)"

export const input = {
	samples: [
		// ROUTINE arrives first but must be scheduled after STAT/URGENT
		{ id: "S601", type: "BLOOD", priority: "ROUTINE", analysisTime: 45, arrivalTime: "08:00", patientId: "P601" },

		// URGENT (URINE) uses GENERAL + URINE equipment, runs in parallel with BLOOD STAT
		{ id: "S603", type: "URINE", priority: "URGENT", analysisTime: 30, arrivalTime: "09:15", patientId: "P603" },

		// STAT (BLOOD) must complete within 60 min of arrival
		{ id: "S602", type: "BLOOD", priority: "STAT", analysisTime: 30, arrivalTime: "09:00", patientId: "P602" },

		// URGENT (BLOOD) arrives same time as STAT but must be after STAT
		{ id: "S604", type: "BLOOD", priority: "URGENT", analysisTime: 60, arrivalTime: "09:00", patientId: "P604" },

		// STAT (TISSUE) later, scheduled quickly, within deadline
		{ id: "S605", type: "TISSUE", priority: "STAT", analysisTime: 40, arrivalTime: "10:10", patientId: "P605" },
	],
	technicians: [
		{ id: "T601", name: "Bob Blood", speciality: "BLOOD", startTime: "08:00", endTime: "17:00" },
		{ id: "T602", name: "Gina General", speciality: "GENERAL", startTime: "08:00", endTime: "17:00" },
		{ id: "T603", name: "Tina Tissue", speciality: "TISSUE", startTime: "10:00", endTime: "17:00" },
	],
	equipment: [
		{ id: "E601", name: "Blood Analyzer", type: "BLOOD", available: true },
		{ id: "E602", name: "Urine Analyzer", type: "URINE", available: true },
		{ id: "E603", name: "Tissue Analyzer", type: "TISSUE", available: true },
	],
}

export const expected = {
	schedule: [
		// STAT BLOOD first: 09:00-09:30 (within 60 min after 09:00)
		{ sampleId: "S602", technicianId: "T601", equipmentId: "E601", startTime: "09:00", endTime: "09:30", priority: "STAT" },

		// URGENT URINE in parallel: GENERAL + URINE equipment: 09:15-09:45
		{ sampleId: "S603", technicianId: "T602", equipmentId: "E602", startTime: "09:15", endTime: "09:45", priority: "URGENT" },

		// URGENT BLOOD next on same resources: 09:30-10:30
		{ sampleId: "S604", technicianId: "T601", equipmentId: "E601", startTime: "09:30", endTime: "10:30", priority: "URGENT" },

		// STAT TISSUE later: 10:10-10:50 (start max(arrival 10:10, tech start 10:00))
		// finishes at 10:50 <= 11:10 (arrival+60) => OK
		{ sampleId: "S605", technicianId: "T603", equipmentId: "E603", startTime: "10:10", endTime: "10:50", priority: "STAT" },

		// ROUTINE BLOOD last, uses BLOOD tech+eq free at 10:30: 10:30-11:15
		{ sampleId: "S601", technicianId: "T601", equipmentId: "E601", startTime: "10:30", endTime: "11:15", priority: "ROUTINE" },
	],
	metrics: {
		// first start 09:00, last end 11:15 => 135 minutes
		totalTime: 135,
		// sum durations: 30 + 60 + 30 + 40 + 45 = 205
		// efficiency = 205/135*100 = 151.851... => rounded to 151.9
		efficiency: 151.9,
		conflicts: 0,
	},
}
