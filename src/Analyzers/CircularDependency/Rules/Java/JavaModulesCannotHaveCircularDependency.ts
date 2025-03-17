import type { Rule } from "@/Rule";
import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import { CodeContentParser } from "@/CodeContentParser";
import { LanguageDetector } from "@/LanguageDetector";

export class JavaModulesCannotHaveCircularDependency implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    async analyze(fileInfo: JavaFileInfo): Promise<null | string> {
        const packageDirectory = fileInfo.packageName.packageName.split(".").join("/");
        const rootDir = fileInfo.filepath.split(packageDirectory).shift();

        const parser = new CodeContentParser(new LanguageDetector());

        for (const dependency of fileInfo.dependencies) {
            const dependencyFilePath = rootDir + dependency.filepath;
            const content = await Bun.file(dependencyFilePath).text();
            const dependencyFileInfo = parser.parse(dependencyFilePath, content) as JavaFileInfo;

            if (dependencyFileInfo.dependencies.length == 0) {
                continue;
            }

            for (const dependency of dependencyFileInfo.dependencies) {
                if (dependency.packageName == fileInfo.packageName.packageName) {
                    return `Module ${fileInfo.packageName.packageName} has circular dependency with ${dependencyFileInfo.packageName.packageName}`;
                }
            }
        }

        return null;
    }
}