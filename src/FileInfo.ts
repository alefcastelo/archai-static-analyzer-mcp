export interface FileInfo {
    filepath: string;
    isPhp(): boolean;
    isGo(): boolean;
    isJava(): boolean;
    isTypescript(): boolean;
}
