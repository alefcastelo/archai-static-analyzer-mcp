import type { FileInfo } from "@/FileInfo";
import type { JavaASTImport } from "@/Parser/JavaAST/ASTNode/JavaASTImport";
import type { JavaASTMethod } from "@/Parser/JavaAST/ASTNode/JavaASTMethod";
import type { JavaASTPackage } from "@/Parser/JavaAST/ASTNode/JavaASTPackage";
import type { JavaASTProperty } from "@/Parser/JavaAST/ASTNode/JavaASTProperty";
import type { JavaASTClass } from "@/Parser/JavaAST/ASTNode/JavaASTClass";

export class JavaFileInfo implements FileInfo {
    constructor(
        public readonly className: JavaASTClass,
        public readonly packageName: JavaASTPackage,
        public readonly dependencies: JavaASTImport[],
        public readonly methods: JavaASTMethod[],
        public readonly properties: JavaASTProperty[]
    ) {
    }

    isJava(): boolean {
        return true;
    }

    isPhp(): boolean {
        return false;
    }

    isGo(): boolean {
        return false;
    }

    isTypescript(): boolean {
        return false;
    }
}