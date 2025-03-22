import { join } from "path";
import { file } from "bun";
import type { RuleGroup } from "@/RuleGroup";
import { LanguageContentParser } from "@/LanguageContentParser";

export class Analyzer {
    protected ruleGroups: Record<string, RuleGroup> = {};

    constructor(
        protected codeContentParser: LanguageContentParser,
    ) {
    }

    addRuleGroup(ruleGroupName: string, ruleGroup: RuleGroup) {
        this.ruleGroups[ruleGroupName] = ruleGroup;
    }

    async analyze(directory: string, filepath: string, ruleGroupName: string): Promise<string[]> {
        const fullPath = join(directory, filepath);
        const content = await file(fullPath).text();
        const fileInfo = this.codeContentParser.parse(fullPath, content);
        
        if (!this.ruleGroups[ruleGroupName]) {
            throw new Error(`Rule group ${ruleGroupName} not found`);
        }

        return this.ruleGroups[ruleGroupName].analyze(fileInfo);
    }
}
