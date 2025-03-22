import type { FileInfo } from "@/FileInfo";

export interface ParserStrategy {
    parse(filepath: string, content: string): FileInfo;
}