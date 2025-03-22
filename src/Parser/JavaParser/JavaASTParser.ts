import type { 
    Program,
    ProgramBody, 
    EmptyStatement, 
    PackageDeclarationStatement, 
    ImportDeclarationStatement, 
    ClassDeclarationStatement,
    ClassDeclarationStatementBody,
    ParameterDeclarationStatement
} from "@/Parser/JavaParser/JavaAST"
import { JavaLexicalAnalyzer, type Token } from "@/Parser/JavaParser/JavaLexicalAnalyzer";


export class JavaASTParser {
    protected lookahead: Token | null = null;

    constructor(
        protected readonly tokenizer: JavaLexicalAnalyzer
    ) {
    }

    parse(code: string): Program {
        this.tokenizer.analyze(code);
        this.lookahead = this.tokenizer.getNextToken();
        return this.program();
    }

    private program(): Program {
        return {
            type: "Program",
            body: this.statementList()
        } 
    }

    private statementList(): ProgramBody[] {
        const statementList: ProgramBody[] = []

        while (this.lookahead) {
            const statement = this.statement()

            if (statement.type === "EmptyStatement") {
                continue
            }

            statementList.push(statement)
        }

        return statementList
    }

    private statement(): ProgramBody {
        if (this.lookahead && this.lookahead.type === JavaLexicalAnalyzer.PACKAGE) {
            return this.packageDeclarationStatement()
        }

        if (this.lookahead && this.lookahead.type === JavaLexicalAnalyzer.IMPORT) {
            return this.importDeclarationStatement()
        }

        if (this.lookahead && this.isClassDeclaration(this.lookahead.type)) {
            return this.classDeclarationStatement()
        }

        return this.emptyStatement()
    }

    private isClassDeclaration(type: string): boolean {
        return type === JavaLexicalAnalyzer.CLASS ||
            type === JavaLexicalAnalyzer.PUBLIC ||
            type === JavaLexicalAnalyzer.PRIVATE ||
            type === JavaLexicalAnalyzer.PROTECTED ||
            type === JavaLexicalAnalyzer.FINAL
    }

    private emptyStatement(): EmptyStatement {
        this.lookahead = this.tokenizer.getNextToken()

        return { type: "EmptyStatement" }
    }

    private packageDeclarationStatement(): PackageDeclarationStatement {      
        this.eat(JavaLexicalAnalyzer.PACKAGE)
        let packageParts = []

        while (this.lookahead && this.lookahead.type === JavaLexicalAnalyzer.IDENTIFIER) {
            packageParts.push(this.lookahead.value)
            this.eat(JavaLexicalAnalyzer.IDENTIFIER)
        }

        this.eat(JavaLexicalAnalyzer.SEMICOLON)

        return { type: "PackageDeclarationStatement", packageName: packageParts.join(".") }
    }

    private importDeclarationStatement(): ImportDeclarationStatement {
        this.eat(JavaLexicalAnalyzer.IMPORT)
        let packageParts = []

        while (this.lookahead && this.lookahead.type === JavaLexicalAnalyzer.IDENTIFIER) {
            packageParts.push(this.lookahead.value)
            this.eat(JavaLexicalAnalyzer.IDENTIFIER)
        }

        this.eat(JavaLexicalAnalyzer.SEMICOLON)

        const importName = packageParts.join(".")

        packageParts.pop()
        const packageName = packageParts.join(".")  

        return { type: "ImportDeclarationStatement", packageName, importName }
    }
    

    private classDeclarationStatement(): ClassDeclarationStatement {
        let className: string| null = null
        let visibility: string|null = null
        let isFinal: boolean = false
        let classParent: string|null = null
        let classImplements: string[] = []

        while (this.lookahead && this.lookahead.type !== JavaLexicalAnalyzer.CURLY_BRACE_OPEN) {
            switch (this.lookahead.type) {
                case JavaLexicalAnalyzer.PRIVATE:
                    this.eat(JavaLexicalAnalyzer.PRIVATE)
                    visibility = this.lookahead.value
                    break

                case JavaLexicalAnalyzer.PROTECTED:
                    this.eat(JavaLexicalAnalyzer.PROTECTED)
                    visibility = this.lookahead.value
                    break

                case JavaLexicalAnalyzer.PUBLIC:
                    this.eat(JavaLexicalAnalyzer.PUBLIC)
                    visibility = this.lookahead.value
                    break

                case JavaLexicalAnalyzer.FINAL:
                    this.eat(JavaLexicalAnalyzer.FINAL)
                    isFinal = true
                    break

                case JavaLexicalAnalyzer.IDENTIFIER:
                    const { value: classNameIdentifier } = this.eat(JavaLexicalAnalyzer.IDENTIFIER)
                    className = classNameIdentifier
                    break

                case JavaLexicalAnalyzer.CLASS:
                    this.eat(JavaLexicalAnalyzer.CLASS)
                    break

                case JavaLexicalAnalyzer.EXTENDS:
                    this.eat(JavaLexicalAnalyzer.EXTENDS)
                    const { value: classParentIdentifier } = this.eat(JavaLexicalAnalyzer.IDENTIFIER)
                    classParent = classParentIdentifier
                    break

                case JavaLexicalAnalyzer.IMPLEMENTS:
                    this.eat(JavaLexicalAnalyzer.IMPLEMENTS)
                    while (this.lookahead.type != JavaLexicalAnalyzer.IMPLEMENTS && this.lookahead.type === JavaLexicalAnalyzer.IDENTIFIER) {
                        const { value: classImplementsIdentifier } = this.eat(JavaLexicalAnalyzer.IDENTIFIER)
                        classImplements.push(classImplementsIdentifier)
                    }
                    break
            }
        }

        return {
            type: "ClassDeclarationStatement",
            className: className!,
            classParent: classParent!,
            implements: classImplements,
            visibility: visibility!,
            isFinal,
            body: this.classBodyStatement()
        }
    }

    private classBodyStatement(): ClassDeclarationStatementBody[] {
        this.eat(JavaLexicalAnalyzer.CURLY_BRACE_OPEN)

        const body: ClassDeclarationStatementBody[] = []

        let visibility: string | null = null
        let isStatic = false
        let isFinal: boolean = false
        let identifiers: string[] = []

        while (this.lookahead && this.lookahead.type !== JavaLexicalAnalyzer.CURLY_BRACE_CLOSE) {

            switch (this.lookahead.type) {
                case JavaLexicalAnalyzer.PRIVATE:
                    this.eat(JavaLexicalAnalyzer.PRIVATE)
                    visibility = this.lookahead.value
                    break

                case JavaLexicalAnalyzer.PROTECTED:
                    this.eat(JavaLexicalAnalyzer.PROTECTED)
                    visibility = this.lookahead.value
                    break

                case JavaLexicalAnalyzer.PUBLIC:
                    this.eat(JavaLexicalAnalyzer.PUBLIC)
                    visibility = this.lookahead.value
                    break

                case JavaLexicalAnalyzer.STATIC:
                    this.eat(JavaLexicalAnalyzer.STATIC)
                    isStatic = true
                    break

                case JavaLexicalAnalyzer.FINAL:
                    this.eat(JavaLexicalAnalyzer.FINAL)
                    isFinal = true
                    break

                case JavaLexicalAnalyzer.IDENTIFIER:
                    const { value: identifier } = this.eat(JavaLexicalAnalyzer.IDENTIFIER)
                    identifiers.push(identifier)
                    break

                case JavaLexicalAnalyzer.SIMPLE_ASIGN:
                    this.eat(JavaLexicalAnalyzer.SIMPLE_ASIGN)

                    body.push({
                        type: "VariableDeclarationStatement",
                        visibility,
                        isStatic,
                        isFinal,
                        varType: identifiers.shift()!,
                        varName: identifiers.shift()!
                    })

                    visibility = null
                    isStatic = false
                    isFinal = false
                    identifiers = []
                    

                    while (this.lookahead.type.toString() !== JavaLexicalAnalyzer.SEMICOLON) {
                        this.eat(this.lookahead.type)
                    }

                    this.eat(JavaLexicalAnalyzer.SEMICOLON)
                    
                    break

                case JavaLexicalAnalyzer.SEMICOLON:
                    this.eat(JavaLexicalAnalyzer.SEMICOLON)

                    body.push({
                        type: "VariableDeclarationStatement",
                        visibility,
                        isStatic,
                        isFinal,
                        varType: identifiers.shift()!,
                        varName: identifiers.shift()!
                    })

                    visibility = null
                    isStatic = false
                    isFinal = false
                    identifiers = []

                    break

                case JavaLexicalAnalyzer.PARENTHESIS_OPEN:
                    if (identifiers.length === 1) {
                        const constructorName = identifiers.shift()
                        body.push({
                            type: "MethodDeclarationStatement",
                            visibility,
                            isStatic,
                            isFinal,
                            returnType: constructorName!,
                            methodName: constructorName!,
                            parameters: this.methodParameters(),
                        })
                    } else {
                        body.push({
                            type: "MethodDeclarationStatement",
                            visibility,
                            isStatic,
                            isFinal,
                            returnType: identifiers.shift()!,
                            methodName: identifiers.shift()!,
                            parameters: this.methodParameters(),
                        })
                    }

                    this.eatMethodBody()

                    visibility = null
                    isStatic = false
                    isFinal = false
                    identifiers = []

                    break
            }
        }

        this.eat(JavaLexicalAnalyzer.CURLY_BRACE_CLOSE)

        return body
    }

    private eatMethodBody() {
        const lifo: string[] = []

        this.eat(JavaLexicalAnalyzer.CURLY_BRACE_OPEN)

        lifo.push("{")

        while (lifo.length > 0) {
            if (!this.lookahead) {
                return
            }

            const token = this.eat(this.lookahead.type)

            if (token.type === JavaLexicalAnalyzer.CURLY_BRACE_OPEN) {
                lifo.push("{")
            }

            if (token.type === JavaLexicalAnalyzer.PARENTHESIS_OPEN) {
                lifo.push("(")
            }

            if (token.type === JavaLexicalAnalyzer.CURLY_BRACE_CLOSE) {
                if (lifo[lifo.length - 1] === "{") {
                    lifo.pop()
                } else {
                    throw new Error("Unexpected token " + token.type)
                }
            }

            if (token.type === JavaLexicalAnalyzer.PARENTHESIS_CLOSE) {
                if (lifo[lifo.length - 1] === "(") {
                    lifo.pop()
                } else {
                    throw new Error("Unexpected token " + token.type)
                }
            }
        }
    }

    private methodParameters(): ParameterDeclarationStatement[] {
        this.eat(JavaLexicalAnalyzer.PARENTHESIS_OPEN)

        const parameters: ParameterDeclarationStatement[] = []
        const identifiers: string[] = []

        while (this.lookahead && this.lookahead.type !== JavaLexicalAnalyzer.PARENTHESIS_CLOSE) {
            switch (this.lookahead.type) {
                case JavaLexicalAnalyzer.IDENTIFIER:
                    const { value: identifier } = this.eat(JavaLexicalAnalyzer.IDENTIFIER)
                    identifiers.push(identifier)
                    break

                case JavaLexicalAnalyzer.COMMA:
                    this.eat(JavaLexicalAnalyzer.COMMA)
                    parameters.push({
                        type: "ParameterDeclarationStatement",
                        varType: identifiers.shift()!,
                        varName: identifiers.pop()!
                    })
                    break

                case JavaLexicalAnalyzer.PARENTHESIS_CLOSE:
                    this.eat(JavaLexicalAnalyzer.PARENTHESIS_CLOSE)
                    if (identifiers.length >= 1) {
                        parameters.push({
                            type: "ParameterDeclarationStatement",
                            varType: identifiers.shift()!,
                            varName: identifiers.pop()!
                        })
                    }
                    break
            }
        }

        this.eat(JavaLexicalAnalyzer.PARENTHESIS_CLOSE)

        return parameters
    }

    private eat(tokenType: string): Token {
        if (this.lookahead && this.lookahead.type !== tokenType) {
            throw new Error(`Unexpected token ${this.lookahead.type}`);
        }

        const token = this.lookahead;

        if (!token) {
            throw new Error(`Unexpected end of input`);
        }

        this.lookahead = this.tokenizer.getNextToken();

        return token;
    }
}