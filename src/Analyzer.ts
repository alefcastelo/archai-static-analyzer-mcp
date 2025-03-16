import type { RuleGroup } from "@/RuleGroup";
import type { FileInfo } from "@/FileInfo";

export class Analyzer {
    constructor(
        protected readonly ruleGroup: RuleGroup,
    ) {
    }

    check(fileInfo: FileInfo): string[] {
        return this.ruleGroup.analyze(fileInfo);
    }
}
