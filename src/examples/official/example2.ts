export const name = "Example 2 — Priority STAT vs URGENT (same resources)"

export const input = {
	samples: [
		{
			id: "S001",
			type: "BLOOD",
			priority: "URGENT",
			analysisTime: 45,
			arrivalTime: "09:00",
			patientId: "P001",
		},
		{
			id: "S002",
			type: "BLOOD",
			priority: "STAT",
			analysisTime: 30,
			arrivalTime: "09:30",
			patientId: "P002",
		},
	],
	technicians: [
		{
			id: "T001",
			speciality: "BLOOD",
			startTime: "08:00",
			endTime: "17:00",
		},
	],
	equipment: [
		{
			id: "E001",
			type: "BLOOD",
			available: true,
		},
	],
}

export const expected = {
	schedule: [
		{
			sampleId: "S002",
			technicianId: "T001",
			equipmentId: "E001",
			startTime: "09:30",
			endTime: "10:00",
			priority: "STAT",
		},
		{
			sampleId: "S001",
			technicianId: "T001",
			equipmentId: "E001",
			startTime: "10:00",
			endTime: "10:45",
			priority: "URGENT",
		},
	],
	metrics: {
		totalTime: 105,
		efficiency: 71.4,
		conflicts: 0,
	},
}
