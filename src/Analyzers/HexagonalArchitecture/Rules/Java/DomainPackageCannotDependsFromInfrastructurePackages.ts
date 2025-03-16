import type { FileInfo } from "@/FileInfo";
import { JavaFileInfo } from "@/FileInfo/JavaFileInfo";
import type { Rule } from "@/Rule";

export class JavaDomainPackageCannotDependsFromInfrastructurePackages implements Rule {
    canAnalyze(fileInfo: FileInfo): boolean {
        return fileInfo.isJava();
    }

    analyze(fileInfo: JavaFileInfo): null | string {
        if (fileInfo.packageName.getPackageName().includes("domain")) {
            for (const dependency of fileInfo.dependencies) {
                if (dependency.getModuleName().includes("infrastructure")) {
                    return "domain package cannot depends from infrastructure packages";
                }
            }
        }

        return null;
    }
}
