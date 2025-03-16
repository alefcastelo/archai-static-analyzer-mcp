import type { RuleGroup } from "@/RuleGroup";
import type { FileInfo } from "@/FileInfo";
import type { Rule } from "@/Rule";

export class HexagonalArchitectureAnalyzer implements RuleGroup {
    constructor(
        protected readonly rules: Rule[],
    ) {
    }

    analyze(fileInfo: FileInfo): string[] {
        const errors: string[] = [];

        for (const rule of this.rules) {
            if (!rule.canAnalyze(fileInfo)) {
                continue;
            }

            const error = rule.analyze(fileInfo);

            if (error) {
                errors.push(error);
            }
        }

        return errors;
    }
}
