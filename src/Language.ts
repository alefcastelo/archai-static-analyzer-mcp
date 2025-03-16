export class Language {
    constructor(
        public readonly name: string,
    ) {}

    isPhp() {
        return this.name === "php";
    }

    isGo() {
        return this.name === "go";
    }

    isJava() {
        return this.name === "java";
    }

    isTypescript() {
        return this.name === "typescript";
    }
}
