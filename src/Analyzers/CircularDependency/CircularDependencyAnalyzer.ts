import type { RuleGroup } from "@/RuleGroup";
import type { FileInfo } from "@/FileInfo";
import type { Rule } from "@/Rule";

export class CircularDependencyAnalyzer implements RuleGroup {
    constructor(
        protected readonly rules: Rule[],
    ) {
    }

    async analyze(fileInfo: FileInfo): Promise<string[]> {
        const errors: string[] = [];

        for (const rule of this.rules) {
            if (!rule.canAnalyze(fileInfo)) {
                continue;
            }

            const error = await rule.analyze(fileInfo);

            if (error) {
                errors.push(error);
            }
        }

        return errors;
    }
}
