import { HexagonalArchitectureAnalyzer } from "@/Analyzers/HexagonalArchitecture/HexagonalArchitectureAnalyzer";
import { JavaClassCannotHaveMoreThanThreeDependencies } from "@/Analyzers/HexagonalArchitecture/Rules/Java/ClassCannotHaveMoreThanThreeDependencies";
import { JavaDomainPackageCannotDependsFromInfrastructurePackages } from "@/Analyzers/HexagonalArchitecture/Rules/Java/DomainPackageCannotDependsFromInfrastructurePackages";
import { JavaDomainUseCaseMustHaveOnePublicMethod } from "@/Analyzers/HexagonalArchitecture/Rules/Java/DomainUseCaseMustHaveOnePublicMethod";
import { JavaDomainUseCaseMustHaveSuffixUseCase } from "@/Analyzers/HexagonalArchitecture/Rules/Java/DomainUseCaseMustHaveSuffixUseCase";
import { JavaModelHasEmailAsPrimitiveType } from "@/Analyzers/HexagonalArchitecture/Rules/Java/ModelHasEmailAsPrimitiveType";
import { JavaNonUserModelHasEmail } from "@/Analyzers/HexagonalArchitecture/Rules/Java/NonUserModelHasEmail";
import { Analyzer } from "@/Analyzer";
import { LanguageDetector } from "@/LanguageDetector";
import { CodeContentParser } from "@/CodeContentParser";

const javaFile = "example/java/CreateUser.java";
const javaContent = await Bun.file(javaFile).text();

const parser = new CodeContentParser(new LanguageDetector());
const fileInfo = parser.parse(javaFile, javaContent);

const hexagonalArchitectureStyle = new HexagonalArchitectureAnalyzer([
    new JavaDomainUseCaseMustHaveOnePublicMethod(),
    new JavaClassCannotHaveMoreThanThreeDependencies(),
    new JavaDomainUseCaseMustHaveSuffixUseCase(),
    new JavaDomainPackageCannotDependsFromInfrastructurePackages(),
    new JavaModelHasEmailAsPrimitiveType(),
    new JavaNonUserModelHasEmail(),
]);

const architecturalStyleCheck = new Analyzer(hexagonalArchitectureStyle);
console.log(architecturalStyleCheck.check(fileInfo).join("\n"));