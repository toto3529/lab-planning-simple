export type Priority = "STAT" | "URGENT" | "ROUTINE"
export type SampleType = "BLOOD" | "URINE" | "TISSUE"
export type TechnicianSpeciality = SampleType | "GENERAL"

export interface Sample {
	id: string
	type: SampleType
	priority: Priority
	analysisTime: number
	arrivalTime: string
	patientId: string
}

export interface Technician {
	id: string
	name: string
	speciality: TechnicianSpeciality
	startTime: string
	endTime: string
}

export interface Equipment {
	id: string
	name: string
	type: SampleType
	available: boolean
}

export interface ScheduleEntry {
	sampleId: string
	technicianId: string
	equipmentId: string
	startTime: string
	endTime: string
	priority: Priority
}

export interface Metrics {
	totalTime: number
	efficiency: number
	conflicts: number
}

export interface Input {
	samples: Sample[]
	technicians: Technician[]
	equipment: Equipment[]
}

export interface Output {
	schedule: ScheduleEntry[]
	metrics: Metrics
}
