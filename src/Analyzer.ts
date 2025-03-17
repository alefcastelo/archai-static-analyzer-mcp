import path from "path";
import type { RuleGroup } from "@/RuleGroup";
import { CodeContentParser } from "@/CodeContentParser";

export class Analyzer {
    protected ruleGroups: Record<string, RuleGroup> = {};

    constructor(
        protected codeContentParser: CodeContentParser,
    ) {
    }

    addRuleGroup(ruleGroupName: string, ruleGroup: RuleGroup) {
        this.ruleGroups[ruleGroupName] = ruleGroup;
    }

    async analyze(directory: string, filepath: string, ruleGroupName: string): Promise<string[]> {
        const fullPath = path.join(directory, filepath);
        const content = await Bun.file(fullPath).text();
        const fileInfo = this.codeContentParser.parse(fullPath, content);
        
        if (!this.ruleGroups[ruleGroupName]) {
            throw new Error(`Rule group ${ruleGroupName} not found`);
        }

        return this.ruleGroups[ruleGroupName].analyze(fileInfo);
    }
}
