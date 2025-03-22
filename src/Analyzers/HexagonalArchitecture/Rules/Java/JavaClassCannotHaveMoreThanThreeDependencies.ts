import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaClassCannotHaveMoreThanThreeDependencies implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    async analyze(fileInfo: JavaFileInfo): Promise<null | string> {
        const classes = fileInfo.ast.body.filter(body => body.type === "ClassDeclarationStatement");

        for (const classDeclaration of classes) {
            const methods = classDeclaration.body.filter(body => body.type === "MethodDeclarationStatement");

            for (const method of methods) {
                if (method.methodName === classDeclaration.className) {
                    continue;
                }

                const methodParameters = method.parameters;

                if (methodParameters.length > 3) {
                    return "class cannot have more than three dependencies";
                }
            }
        }

        return null;
    }
}