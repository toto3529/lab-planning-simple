import { planifyLab } from "./planifyLab"
import { toMinutes } from "./time"
import type { Input, Output, ScheduleEntry, Metrics } from "./types"

export type ExampleModule = {
	name: string
	input: unknown
	expected: unknown
}

export type ThrowCheck = {
	name: string
	input: unknown
}

export type OutputCheck = {
	name: string
	input: unknown
	expected: Output
}

function schedulesEqual(actual: ScheduleEntry[], expected: ScheduleEntry[]) {
	if (actual.length !== expected.length) {
		return { ok: false, reason: `schedule length mismatch: actual=${actual.length}, expected=${expected.length}` }
	}

	for (let i = 0; i < actual.length; i++) {
		const a = actual[i]
		const e = expected[i]

		const keys: (keyof ScheduleEntry)[] = ["sampleId", "technicianId", "equipmentId", "startTime", "endTime", "priority"]
		for (const k of keys) {
			if (a[k] !== e[k]) {
				return { ok: false, reason: `schedule mismatch at index ${i} (${String(k)}): actual=${a[k]} expected=${e[k]}` }
			}
		}
	}

	return { ok: true as const }
}

function metricsEqual(actual: Metrics, expected: Metrics) {
	if (actual.totalTime !== expected.totalTime) {
		return { ok: false, reason: `metrics.totalTime mismatch: actual=${actual.totalTime}, expected=${expected.totalTime}` }
	}
	if (actual.efficiency !== expected.efficiency) {
		return { ok: false, reason: `metrics.efficiency mismatch: actual=${actual.efficiency}, expected=${expected.efficiency}` }
	}
	if (actual.conflicts !== expected.conflicts) {
		return { ok: false, reason: `metrics.conflicts mismatch: actual=${actual.conflicts}, expected=${expected.conflicts}` }
	}
	return { ok: true as const }
}

function printSchedule(label: string, schedule: ScheduleEntry[]) {
	console.log(label)
	for (const s of schedule) {
		console.log(`- ${s.sampleId} | tech=${s.technicianId} | eq=${s.equipmentId} | ${s.startTime}-${s.endTime} | ${s.priority}`)
	}
}

function runExample(ex: ExampleModule): boolean {
	console.log("==============================================")
	console.log(ex.name)

	let actual: Output
	try {
		actual = planifyLab(ex.input as Input)
	} catch (err) {
		console.log("❌ FAIL (unexpected error):")
		console.log(err)
		return false
	}

	const expected = ex.expected as Output

	const scheduleCheck = schedulesEqual(actual.schedule, expected.schedule)
	const metricsCheck = metricsEqual(actual.metrics, expected.metrics)

	if (scheduleCheck.ok && metricsCheck.ok) {
		console.log("✅ PASS")
		return true
	}

	console.log("❌ FAIL")
	if (!scheduleCheck.ok) console.log(`- ${scheduleCheck.reason}`)
	if (!metricsCheck.ok) console.log(`- ${metricsCheck.reason}`)

	console.log("\nActual schedule:")
	printSchedule("", actual.schedule)

	console.log("Expected schedule:")
	printSchedule("", expected.schedule)

	console.log(
		`\nActual metrics: totalTime=${actual.metrics.totalTime} | efficiency=${actual.metrics.efficiency} | conflicts=${actual.metrics.conflicts}`,
	)
	console.log(
		`Expected metrics: totalTime=${expected.metrics.totalTime} | efficiency=${expected.metrics.efficiency} | conflicts=${expected.metrics.conflicts}`,
	)

	return false
}

export function runOfficialExamples(examples: ExampleModule[]) {
	let passed = 0
	for (const ex of examples) {
		if (runExample(ex)) passed++
	}

	console.log("==============================================")
	console.log(`Result: ${passed}/${examples.length} official examples passed`)

	return { passed, total: examples.length }
}

export function runCustomThrowCheck(check: ThrowCheck): boolean {
	console.log("==============================================")
	console.log(check.name)

	try {
		planifyLab(check.input as Input)
		console.log("❌ FAIL (expected an error, but got a schedule)")
		return false
	} catch {
		console.log("✅ PASS (error thrown as expected)")
		return true
	}
}

export function runCustomOutputCheck(check: OutputCheck): boolean {
	console.log("==============================================")
	console.log(check.name)

	let actual: Output
	try {
		actual = planifyLab(check.input as Input)
	} catch (err) {
		console.log("❌ FAIL (unexpected error):")
		console.log(err)
		return false
	}

	const scheduleCheck = schedulesEqual(actual.schedule, check.expected.schedule)
	const metricsCheck = metricsEqual(actual.metrics, check.expected.metrics)

	if (scheduleCheck.ok && metricsCheck.ok) {
		console.log("✅ PASS")
		return true
	}

	console.log("❌ FAIL")
	if (!scheduleCheck.ok) console.log(`- ${scheduleCheck.reason}`)
	if (!metricsCheck.ok) console.log(`- ${metricsCheck.reason}`)
	return false
}

export function runCustomChecks(throwChecks: ThrowCheck[], outputChecks: OutputCheck[]) {
	console.log("==============================================")
	console.log("Custom checks:")

	let passed = 0
	let total = 0

	for (const c of throwChecks) {
		total++
		if (runCustomThrowCheck(c)) passed++
	}

	for (const c of outputChecks) {
		total++
		if (runCustomOutputCheck(c)) passed++
	}

	console.log("==============================================")
	console.log(`Custom result: ${passed}/${total} checks passed`)

	return { passed, total }
}
