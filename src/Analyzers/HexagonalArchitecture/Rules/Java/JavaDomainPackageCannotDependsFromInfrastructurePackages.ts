import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaDomainPackageCannotDependsFromInfrastructurePackages implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    async analyze(fileInfo: JavaFileInfo): Promise<null | string> {
        const packageName = fileInfo.ast.body.find(body => body.type === "PackageDeclarationStatement");
        const imports = fileInfo.ast.body.filter(body => body.type === "ImportDeclarationStatement");

        if (packageName && !packageName.packageName.includes(".domain.")) {
            return null
        }

        for (const importDeclaration of imports) {
            if (importDeclaration.packageName.includes(".infrastructure.")) {
                return "domain package cannot depends from infrastructure packages";
            }
        }

        return null;
    }
}
