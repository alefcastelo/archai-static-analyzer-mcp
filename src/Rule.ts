import type { FileInfo } from "@/FileInfo";

export interface Rule {
    canAnalyze(fileInfo: FileInfo): boolean;
    analyze(fileInfo: FileInfo): null | string | Promise<null | string>;
}
