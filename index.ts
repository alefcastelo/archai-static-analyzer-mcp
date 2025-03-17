import { Analyzer } from "@/Analyzer";
import { LanguageDetector } from "@/LanguageDetector";
import { CodeContentParser } from "@/CodeContentParser";
import { HexagonalArchitectureAnalyzer } from "@/Analyzers/HexagonalArchitecture/HexagonalArchitectureAnalyzer";
import { JavaClassCannotHaveMoreThanThreeDependencies } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaClassCannotHaveMoreThanThreeDependencies";
import { JavaDomainPackageCannotDependsFromInfrastructurePackages } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaDomainPackageCannotDependsFromInfrastructurePackages";
import { JavaDomainUseCaseMustHaveOnePublicMethod } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaDomainUseCaseMustHaveOnePublicMethod";
import { JavaDomainUseCaseMustHaveSuffixUseCase } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaDomainUseCaseMustHaveSuffixUseCase";
import { JavaModelHasEmailAsPrimitiveType } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaModelHasEmailAsPrimitiveType";
import { JavaNonUserModelHasEmail } from "@/Analyzers/HexagonalArchitecture/Rules/Java/JavaNonUserModelHasEmail";
import { CircularDependencyAnalyzer } from "@/Analyzers/CircularDependency/CircularDependencyAnalyzer";
import { JavaModulesCannotHaveCircularDependency } from "@/Analyzers/CircularDependency/Rules/Java/JavaModulesCannotHaveCircularDependency";

const hexagonalArchitectureAnalyzer = new HexagonalArchitectureAnalyzer([
    new JavaDomainUseCaseMustHaveOnePublicMethod(),
    new JavaClassCannotHaveMoreThanThreeDependencies(),
    new JavaDomainUseCaseMustHaveSuffixUseCase(),
    new JavaDomainPackageCannotDependsFromInfrastructurePackages(),
    new JavaModelHasEmailAsPrimitiveType(),
    new JavaNonUserModelHasEmail(),
]);

const circularDependencyAnalyzer = new CircularDependencyAnalyzer([
    new JavaModulesCannotHaveCircularDependency(),
]);

const directory = "/Users/alefcastelo/workspace/mcp/archai/examples/hexagonal-architecture";
const filepath = "src/com/alefcastelo/domain/usecase/CreateUserUseCase.java";

const analyzer = new Analyzer(new CodeContentParser(new LanguageDetector()));
analyzer.addRuleGroup("hexagonal-architecture", hexagonalArchitectureAnalyzer);
analyzer.addRuleGroup("circular-dependency", circularDependencyAnalyzer);

console.log((await analyzer.analyze(directory, filepath, "hexagonal-architecture")).join("\n"));