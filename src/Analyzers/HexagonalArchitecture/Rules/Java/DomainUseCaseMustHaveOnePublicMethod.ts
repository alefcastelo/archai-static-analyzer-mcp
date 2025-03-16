import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaDomainUseCaseMustHaveOnePublicMethod implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    analyze(fileInfo: JavaFileInfo): null | string {
        if (!fileInfo.packageName.packageName.includes("usecase")) {
            return null;
        }

        let publicMethods = 0;

        for (const method of fileInfo.methodDeclarations) {
            const isConstuctor = method.methodName === fileInfo.className.className;

            if (isConstuctor) {
                continue;
            }

            if (method.methodAccessModifier === "public") {
                publicMethods++;
            }
        }

        if (publicMethods > 1) {
            return "use case class must have only one public method";
        }

        if (publicMethods === 0) {
            return "use case class must have at least one public method";
        }
        
        return null;
    }
}