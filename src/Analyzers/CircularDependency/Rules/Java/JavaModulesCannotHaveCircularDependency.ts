import { file } from "bun";
import { dirname, join } from "path";
import type { Rule } from "@/Rule";
import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import { LanguageContentParser } from "@/LanguageContentParser";
import type { ImportDeclarationStatement, PackageDeclarationStatement } from "@/Parser/JavaParser/JavaAST";

export class JavaModulesCannotHaveCircularDependency implements Rule {

    constructor(
        protected readonly parser: LanguageContentParser,
        protected readonly maxDeep: number = 10
    ) {
    }

    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    async analyze(fileInfo: JavaFileInfo): Promise<null | string> {
        const packageName = fileInfo.ast.body
            .find(programBody => programBody.type === "PackageDeclarationStatement") as PackageDeclarationStatement;

        if (!packageName) {
            return null;
        }

        return this.recursiveAnalyze(1, fileInfo, new Set());
    }

    async recursiveAnalyze(
        deep: number,
        fileInfo: JavaFileInfo,
        visited: Set<string>
    ): Promise<null | string> {
        if (deep > this.maxDeep) {
            return null;
        }

        const packageName = fileInfo.ast.body
            .find(programBody => programBody.type === "PackageDeclarationStatement") as PackageDeclarationStatement;

        if (visited.has(packageName.packageName)) {
            return `Circular dependency detected: ${[...visited].join(" -> ")} -> ${packageName.packageName}`;
        }

        visited.add(packageName.packageName);

        const dependencies = fileInfo.ast.body
            .filter(programBody => programBody.type === "ImportDeclarationStatement") as ImportDeclarationStatement[];

        const packageDir = dirname(fileInfo.filepath)
            .replace(packageName.packageName.replaceAll('.', "/"), "")

        for (const dependency of dependencies) {
            const dependencyFilename = join(packageDir, dependency.importName.replaceAll('.', "/") + ".java");
            const dependencyContent = await file(dependencyFilename).text();
            const dependencyFileInfo = this.parser.parse(dependencyFilename, dependencyContent) as JavaFileInfo;
            const dependenciesOfDependency = dependencyFileInfo.ast.body.filter(programBody => programBody.type === "ImportDeclarationStatement") as ImportDeclarationStatement[];

            if (dependenciesOfDependency.length == 0) {
                continue;
            }

            return await this.recursiveAnalyze(deep + 1, dependencyFileInfo, visited);
        }

        return null;
    }
}