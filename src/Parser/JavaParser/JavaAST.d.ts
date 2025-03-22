export type ParameterDeclarationStatement = {
    type: "ParameterDeclarationStatement",
    varType: string,
    varName: string
}

export type MethodDeclarationStatement = {
    type: "MethodDeclarationStatement",
    visibility: string | null,
    isStatic: boolean,
    isFinal: boolean,
    returnType: string,
    methodName: string,
    parameters: ParameterDeclarationStatement[],
}

export type VariableDeclarationStatement = {
    type: "VariableDeclarationStatement",
    visibility: string | null,
    isStatic: boolean,
    isFinal: boolean,
    varType: string,
    varName: string,
}

export type ClassDeclarationStatementBody = VariableDeclarationStatement |
    MethodDeclarationStatement |
    EmptyStatement

export type ClassDeclarationStatement = {
    type: "ClassDeclarationStatement",
    className: string,
    classParent: string,
    implements: string[],
    visibility: string,
    isFinal: boolean,
    body: ClassDeclarationStatementBody[],
}

export type PackageDeclarationStatement = {
    type: "PackageDeclarationStatement",
    packageName: string,
}

export type ImportDeclarationStatement = {
    type: "ImportDeclarationStatement",
    packageName: string,
    importName: string,
}

export type EmptyStatement = {
    type: "EmptyStatement",
}

export type ProgramBody = PackageDeclarationStatement |
    ImportDeclarationStatement |
    ClassDeclarationStatement |
    EmptyStatement


export type Program = {
    type: "Program",
    body: ProgramBody[],
}