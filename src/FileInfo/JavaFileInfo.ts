import type { FileInfo } from "@/FileInfo";
import type { Program } from "@/Parser/JavaParser/JavaAST";

export class JavaFileInfo implements FileInfo {
    constructor(
        public readonly filepath: string,
        public readonly ast: Program,
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