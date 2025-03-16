import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaClassCannotHaveMoreThanThreeDependencies implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    analyze(fileInfo: JavaFileInfo): null | string {
        const constuctorMethod = fileInfo.methods.find(method => method.methodName === fileInfo.className.getClassName());

        if (!constuctorMethod) {
            return "class must have a constructor method";
        }

        if (constuctorMethod.methodArguments.length > 3) {
            return "class cannot have more than three dependencies";
        }

        return null;
    }
}