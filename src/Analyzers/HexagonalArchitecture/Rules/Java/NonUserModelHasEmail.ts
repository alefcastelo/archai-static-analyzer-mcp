import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaNonUserModelHasEmail implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    analyze(fileInfo: JavaFileInfo): null | string {
        if (!fileInfo.packageName.getPackageName().includes("model")) {
            return null;
        }

        if (fileInfo.className.getClassName() === "User") {
            return null;
        }

        const emailProperty = fileInfo.properties.find((property) => property.getPropertyName() === 'email');

        if (emailProperty) {
            return "model has email property, and the email is a user specific property, it should be in the user model (if this model is a user, in diffente state like before/after be persisted ignore this recommendation).";
        }

        return null;
    }
}