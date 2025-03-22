import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaDomainUseCaseMustHaveSuffixUseCase implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    async analyze(fileInfo: JavaFileInfo): Promise<null | string> {
        const classes = fileInfo.ast.body.filter(body => body.type === "ClassDeclarationStatement");

        for (const classDeclaration of classes) {
            if (!classDeclaration.className.endsWith("UseCase.java")) {
                return "use case class must have suffix UseCase";
            }
        }

        return null;
    }
}
