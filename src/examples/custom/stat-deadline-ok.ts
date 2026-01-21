export const name = "Custom — STAT respected (< 60min) + ROUTINE scheduled after"

export const input = {
	samples: [
		{
			id: "S200",
			type: "BLOOD",
			priority: "ROUTINE",
			analysisTime: 60,
			arrivalTime: "08:00",
			patientId: "P200",
		},
		{
			id: "S201",
			type: "BLOOD",
			priority: "STAT",
			analysisTime: 30,
			arrivalTime: "09:00",
			patientId: "P201",
		},
	],
	technicians: [
		{
			id: "T200",
			name: "Alice",
			speciality: "BLOOD",
			startTime: "08:00",
			endTime: "17:00",
		},
	],
	equipment: [
		{
			id: "E200",
			name: "Blood Analyzer",
			type: "BLOOD",
			available: true,
		},
	],
}

export const expected = {
	schedule: [
		{
			sampleId: "S201",
			technicianId: "T200",
			equipmentId: "E200",
			startTime: "09:00",
			endTime: "09:30",
			priority: "STAT",
		},
		{
			sampleId: "S200",
			technicianId: "T200",
			equipmentId: "E200",
			startTime: "09:30",
			endTime: "10:30",
			priority: "ROUTINE",
		},
	],
	metrics: {
		// computeMetrics: first start (09:00) -> last end (10:30) = 90
		totalTime: 90,
		// durations: 30 + 60 = 90 -> 100%
		efficiency: 100.0,
		conflicts: 0,
	},
}
