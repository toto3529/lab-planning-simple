export const name = "Custom — STAT deadline must be <= arrival + 60 (should throw)"

export const input = {
	samples: [
		{
			id: "S100",
			type: "BLOOD",
			priority: "STAT",
			analysisTime: 30,
			arrivalTime: "09:00",
			patientId: "P100",
		},
	],
	technicians: [
		{
			id: "T100",
			name: "Late Tech",
			speciality: "BLOOD",
			startTime: "10:00", // trop tard -> fin 10:30 > 10:00 (arrival+60)
			endTime: "17:00",
		},
	],
	equipment: [
		{
			id: "E100",
			name: "Blood Analyzer",
			type: "BLOOD",
			available: true,
		},
	],
}
