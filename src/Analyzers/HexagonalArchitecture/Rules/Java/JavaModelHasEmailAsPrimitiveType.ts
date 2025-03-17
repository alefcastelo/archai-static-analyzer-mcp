import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaModelHasEmailAsPrimitiveType implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    async analyze(fileInfo: JavaFileInfo): Promise<null | string> {
        if (!fileInfo.packageName.packageName.includes("model")) {
            return null;
        }

        const emailProperty = fileInfo.properties.find((property) => property.getPropertyName() === 'email');

        if (emailProperty && emailProperty.type === 'String') {
            return "model has email as primitive type";
        }

        return null;
    }
}