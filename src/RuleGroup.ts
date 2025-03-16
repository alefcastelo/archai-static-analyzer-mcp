import type { FileInfo } from "@/FileInfo";

export interface RuleGroup {
    analyze(fileInfo: FileInfo): string[];
}
