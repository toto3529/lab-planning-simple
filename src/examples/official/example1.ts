export const name = "Example 1 — Single sample (URGENT BLOOD)"

export const input = {
	samples: [
		{
			id: "S001",
			type: "BLOOD",
			priority: "URGENT",
			analysisTime: 30,
			arrivalTime: "09:00",
			patientId: "P001",
		},
	],
	technicians: [
		{
			id: "T001",
			name: "Alice Martin",
			speciality: "BLOOD",
			startTime: "08:00",
			endTime: "17:00",
		},
	],
	equipment: [
		{
			id: "E001",
			name: "Analyseur Sang A",
			type: "BLOOD",
			available: true,
		},
	],
}

export const expected = {
	schedule: [
		{
			sampleId: "S001",
			technicianId: "T001",
			equipmentId: "E001",
			startTime: "09:00",
			endTime: "09:30",
			priority: "URGENT",
		},
	],
	metrics: {
		totalTime: 30,
		efficiency: 100.0,
		conflicts: 0,
	},
}
