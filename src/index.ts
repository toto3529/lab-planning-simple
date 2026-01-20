import { planifyLab } from "./planifyLab"
import { officialExamples } from "./examples"
import type { Input, Metrics, Output, ScheduleEntry } from "./types"

type ExampleCase = {
	name: string
	input: Input
	expected: Output
}

const examples = officialExamples as unknown as readonly ExampleCase[]

function schedulesEqual(actual: ScheduleEntry[], expected: ScheduleEntry[]): { ok: boolean; reason?: string } {
	if (actual.length !== expected.length) {
		return { ok: false, reason: `schedule length mismatch: actual=${actual.length}, expected=${expected.length}` }
	}

	const keys: (keyof ScheduleEntry)[] = ["sampleId", "technicianId", "equipmentId", "startTime", "endTime", "priority"]

	for (let i = 0; i < expected.length; i++) {
		const a = actual[i]
		const e = expected[i]

		for (const k of keys) {
			if (a[k] !== e[k]) {
				return { ok: false, reason: `schedule[${i}].${k} mismatch: actual="${a[k]}", expected="${e[k]}"` }
			}
		}
	}

	return { ok: true }
}

function metricsEqual(actual: Metrics, expected: Metrics): { ok: boolean; reason?: string } {
	if (actual.totalTime !== expected.totalTime) {
		return { ok: false, reason: `metrics.totalTime mismatch: actual=${actual.totalTime}, expected=${expected.totalTime}` }
	}

	const aEff = Math.round(actual.efficiency * 10) / 10
	const eEff = Math.round(expected.efficiency * 10) / 10
	if (aEff !== eEff) {
		return { ok: false, reason: `metrics.efficiency mismatch: actual=${aEff}, expected=${eEff}` }
	}

	if (actual.conflicts !== expected.conflicts) {
		return { ok: false, reason: `metrics.conflicts mismatch: actual=${actual.conflicts}, expected=${expected.conflicts}` }
	}

	return { ok: true }
}

function printSchedule(label: string, schedule: ScheduleEntry[]) {
	console.log(label)
	for (const s of schedule) {
		console.log(`- ${s.sampleId} | tech=${s.technicianId} | eq=${s.equipmentId} | ${s.startTime}-${s.endTime} | ${s.priority}`)
	}
}

function printMetrics(label: string, m: Metrics) {
	console.log(`${label} totalTime=${m.totalTime} | efficiency=${m.efficiency} | conflicts=${m.conflicts}`)
}

function runExample(ex: ExampleCase): boolean {
	console.log("==============================================")
	console.log(ex.name)

	let actual: Output
	try {
		actual = planifyLab(ex.input)
	} catch (err) {
		console.log("❌ ERROR while running planifyLab:")
		console.log(err)
		return false
	}

	const scheduleCheck = schedulesEqual(actual.schedule, ex.expected.schedule)
	const metricsCheck = metricsEqual(actual.metrics, ex.expected.metrics)

	if (scheduleCheck.ok && metricsCheck.ok) {
		console.log("✅ PASS")
		return true
	}

	console.log("❌ FAIL")
	if (!scheduleCheck.ok) console.log(`- ${scheduleCheck.reason}`)
	if (!metricsCheck.ok) console.log(`- ${metricsCheck.reason}`)

	console.log("")
	printSchedule("Actual schedule:", actual.schedule)
	printSchedule("Expected schedule:", ex.expected.schedule)

	console.log("")
	printMetrics("Actual metrics:", actual.metrics)
	printMetrics("Expected metrics:", ex.expected.metrics)

	return false
}

function main() {
	let passed = 0

	for (const ex of examples) {
		const ok = runExample(ex)
		if (ok) passed++
	}

	console.log("==============================================")
	console.log(`Result: ${passed}/${examples.length} examples passed`)

	if (passed !== examples.length) {
		process.exitCode = 1
	}
}

main()
