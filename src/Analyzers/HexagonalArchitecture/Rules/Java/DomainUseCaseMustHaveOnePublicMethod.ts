import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaDomainUseCaseMustHaveOnePublicMethod implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    analyze(fileInfo: JavaFileInfo): null | string {
        if (!fileInfo.packageName.getPackageName().includes("usecase")) {
            return null;
        }

        if (fileInfo.methods.length > 1) {
            return "use case class must have only one public method";
        }

        if (fileInfo.methods.length === 0) {
            return "use case class must have at least one public method";
        }

        return null;
    }
}