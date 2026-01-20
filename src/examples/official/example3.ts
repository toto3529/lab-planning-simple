export const name = "Example 3 — Resources + parallel scheduling"

export const input = {
	samples: [
		{
			id: "S001",
			type: "BLOOD",
			priority: "URGENT",
			analysisTime: 60,
			arrivalTime: "09:00",
			patientId: "P001",
		},
		{
			id: "S002",
			type: "URINE",
			priority: "URGENT",
			analysisTime: 30,
			arrivalTime: "09:15",
			patientId: "P002",
		},
		{
			id: "S003",
			type: "BLOOD",
			priority: "ROUTINE",
			analysisTime: 45,
			arrivalTime: "09:00",
			patientId: "P003",
		},
	],
	technicians: [
		{
			id: "T001",
			speciality: "BLOOD",
			startTime: "08:00",
			endTime: "17:00",
		},
		{
			id: "T002",
			speciality: "GENERAL",
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
		{
			id: "E002",
			type: "URINE",
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
			endTime: "10:00",
			priority: "URGENT",
		},
		{
			sampleId: "S002",
			technicianId: "T002",
			equipmentId: "E002",
			startTime: "09:15",
			endTime: "09:45",
			priority: "URGENT",
		},
		{
			sampleId: "S003",
			technicianId: "T001",
			equipmentId: "E001",
			startTime: "10:00",
			endTime: "10:45",
			priority: "ROUTINE",
		},
	],
	metrics: {
		totalTime: 105,
		efficiency: 78.6,
		conflicts: 0,
	},
}
