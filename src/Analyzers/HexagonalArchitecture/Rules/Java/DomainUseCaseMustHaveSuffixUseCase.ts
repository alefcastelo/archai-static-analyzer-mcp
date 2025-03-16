import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaDomainUseCaseMustHaveSuffixUseCase implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    analyze(fileInfo: JavaFileInfo): null | string {
        if (!fileInfo.packageName.packageName.includes("usecase")) {
            return null;
        }

        if (fileInfo.className.className.endsWith("UseCase")) {
            return null;
        }

        return "use case class must have suffix UseCase";
    }
}
