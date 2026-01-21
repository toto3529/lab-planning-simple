import { officialExamples } from "./examples"
import * as statDeadlineThrows from "./examples/custom/stat-deadline-throws"
import * as statDeadlineOk from "./examples/custom/stat-deadline-ok"
import type { Output } from "./types"
import { runCustomChecks, runOfficialExamples } from "./runner"

function main() {
	const official = runOfficialExamples(officialExamples)

	const custom = runCustomChecks(
		[{ name: statDeadlineThrows.name, input: statDeadlineThrows.input }],
		[{ name: statDeadlineOk.name, input: statDeadlineOk.input, expected: statDeadlineOk.expected as Output }],
	)

	if (official.passed !== official.total || custom.passed !== custom.total) {
		process.exitCode = 1
	}
}

main()
