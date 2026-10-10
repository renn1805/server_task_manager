# Planejamento de evolução arquitetural — Task Manager

> Documento de planejamento contextualizado a partir da análise do estado atual do servidor e dos objetivos de evolução do projeto.
>
> **Escopo:** requisitos, especificações, contratos, arquitetura, persistência, API, testes, segurança e documentação.
>
> **Nota sobre o diagnóstico:** os pontos sobre o estado atual refletem a inspeção do ZIP disponibilizado. Não representam uma execução integral da aplicação nem uma auditoria de segurança completa. Antes de transformar um achado em tarefa definitiva, confirme-o no código atualizado e nos testes.

---

## Sumário

- [1. Contexto do projeto](#parte-1-1-contexto-do-projeto)
  - [1.1 Estado atual da evolução](#parte-2-1-1-estado-atual-da-evolu-o)
  - [1.2 Objetivos](#parte-3-1-2-objetivos)
- [2. Estratégia de trabalho: requisitos antes da implementação](#parte-4-2-estrat-gia-de-trabalho-requisitos-antes-da-implementa-o)
  - [2.1 Distinguir três fontes de verdade](#parte-5-2-1-distinguir-tr-s-fontes-de-verdade)
  - [2.2 Tipos de contrato](#parte-6-2-2-tipos-de-contrato)
- [3. Organização recomendada da documentação](#parte-7-3-organiza-o-recomendada-da-documenta-o)
  - [3.1 Conteúdo de cada documento](#parte-8-3-1-conte-do-de-cada-documento)
  - [3.2 OpenAPI como contrato da API](#parte-9-3-2-openapi-como-contrato-da-api)
  - [3.3 Architecture Decision Records (ADRs)](#parte-10-3-3-architecture-decision-records-adrs)
- [4. Diagnóstico arquitetural do estado atual](#parte-11-4-diagn-stico-arquitetural-do-estado-atual)
  - [4.1 Organização das responsabilidades](#parte-12-4-1-organiza-o-das-responsabilidades)
  - [4.2 Arquitetura de destino](#parte-14-4-2-arquitetura-de-destino)
  - [4.3 Estrutura de diretórios possível](#parte-17-4-3-estrutura-de-diret-rios-poss-vel)
- [5. Repositories e persistência](#parte-18-5-repositories-e-persist-ncia)
  - [5.1 Estado observado](#parte-19-5-1-estado-observado)
  - [5.2 Regras para a implementação dos repositories](#parte-20-5-2-regras-para-a-implementa-o-dos-repositories)
  - [5.3 Interfaces: quando criar](#parte-21-5-3-interfaces-quando-criar)
- [6. Casos de uso e transações](#parte-22-6-casos-de-uso-e-transa-es)
  - [Exemplo: criação de workspace](#parte-23-exemplo-cria-o-de-workspace)
  - [Outros fluxos para refatorar](#parte-24-outros-fluxos-para-refatorar)
- [7. Contrato HTTP e tratamento de erros](#parte-25-7-contrato-http-e-tratamento-de-erros)
  - [7.1 Situação observada](#parte-26-7-1-situa-o-observada)
  - [7.2 Política recomendada](#parte-27-7-2-pol-tica-recomendada)
  - [7.3 Estrutura possível para erros](#parte-28-7-3-estrutura-poss-vel-para-erros)
  - [7.4 Status HTTP de referência](#parte-29-7-4-status-http-de-refer-ncia)
- [8. TDD e estratégia de testes](#parte-30-8-tdd-e-estrat-gia-de-testes)
  - [8.1 Estado observado](#parte-31-8-1-estado-observado)
  - [8.2 Camadas de teste](#parte-32-8-2-camadas-de-teste)
  - [8.3 Ciclo de TDD](#parte-33-8-3-ciclo-de-tdd)
  - [8.4 Primeiro fluxo de referência](#parte-34-8-4-primeiro-fluxo-de-refer-ncia)
  - [8.5 Ambiente de testes](#parte-35-8-5-ambiente-de-testes)
- [9. Modelo de dados e regras de domínio](#parte-36-9-modelo-de-dados-e-regras-de-dom-nio)
  - [9.1 Opcionalidade e cardinalidade](#parte-37-9-1-opcionalidade-e-cardinalidade)
  - [9.2 Gerentes e membros](#parte-38-9-2-gerentes-e-membros)
  - [9.3 Comentários](#parte-39-9-3-coment-rios)
  - [9.4 Enums e validação](#parte-40-9-4-enums-e-valida-o)
  - [9.5 Convenções de nomenclatura](#parte-41-9-5-conven-es-de-nomenclatura)
  - [9.6 Exclusões em cascata](#parte-42-9-6-exclus-es-em-cascata)
- [10. Segurança e autorização](#parte-43-10-seguran-a-e-autoriza-o)
  - [10.1 Identidade confiável](#parte-44-10-1-identidade-confi-vel)
  - [10.2 Escopo das consultas](#parte-45-10-2-escopo-das-consultas)
  - [10.3 Consistência de autorização](#parte-46-10-3-consist-ncia-de-autoriza-o)
  - [10.4 Credenciais e dados sensíveis](#parte-47-10-4-credenciais-e-dados-sens-veis)
- [11. Outros achados específicos da inspeção](#parte-48-11-outros-achados-espec-ficos-da-inspe-o)
- [12. Integração entre servidor e cliente Android](#parte-49-12-integra-o-entre-servidor-e-cliente-android)
- [13. Plano de execução por fases](#parte-50-13-plano-de-execu-o-por-fases)
  - [Fase 1 — Inventário e requisitos](#parte-51-fase-1-invent-rio-e-requisitos)
  - [Fase 2 — Regras de domínio e critérios de aceitação](#parte-52-fase-2-regras-de-dom-nio-e-crit-rios-de-aceita-o)
  - [Fase 3 — Contratos](#parte-53-fase-3-contratos)
  - [Fase 4 — Infraestrutura de testes e segurança](#parte-54-fase-4-infraestrutura-de-testes-e-seguran-a)
  - [Fase 5 — Fluxo vertical de referência](#parte-55-fase-5-fluxo-vertical-de-refer-ncia)
  - [Fase 6 — Expansão incremental](#parte-56-fase-6-expans-o-incremental)
  - [Fase 7 — Consolidação](#parte-57-fase-7-consolida-o)
- [14. Priorização](#parte-58-14-prioriza-o)
- [15. Definição de concluído (Definition of Done)](#parte-59-15-defini-o-de-conclu-do-definition-of-done)
- [16. Diretrizes para evitar retrabalho](#parte-60-16-diretrizes-para-evitar-retrabalho)
- [17. Próximos passos imediatos](#parte-61-17-pr-ximos-passos-imediatos)
- [18. Resultado esperado](#parte-62-18-resultado-esperado)

---

<a id="parte-1-1-contexto-do-projeto"></a>
## 1. Contexto do projeto

O projeto consiste em um gerenciador de tarefas com servidor desenvolvido em TypeScript e cliente Android em Kotlin. O servidor utiliza Express e Prisma e possui entidades e relacionamentos envolvendo usuários, workspaces, equipes, tarefas, objetivos e comentários.

O sistema já contém uma parte significativa de sua estrutura funcional: rotas, controllers, validação de entrada, modelos de dados, lógica de operações e tratamento inicial de erros. A complexidade crescente decorre, entre outros fatores, da quantidade de endpoints, das relações entre entidades, das regras de autorização, das decisões arquiteturais e da necessidade de manter o contrato consistente entre servidor e cliente.

A documentação é uma entrega importante do projeto. Ela deve servir como referência para o desenvolvimento e para a manutenção, e não apenas descrever retrospectivamente a implementação.

<a id="parte-2-1-1-estado-atual-da-evolu-o"></a>
### 1.1 Estado atual da evolução

O servidor está passando por uma refatoração para separar responsabilidades e aproximar a organização de um MVC em camadas, com aplicação dos princípios SOLID onde forem úteis.

As mudanças em andamento incluem:

- criação de repositories para retirar o acesso direto ao Prisma dos controllers;
- centralização e padronização das respostas de erro;
- intenção de estender o tratamento centralizado de exceções a todos os controllers;
- introdução de TDD durante a refatoração;
- planejamento de uma suíte de testes mais abrangente para o servidor.

A decisão de implementar repositories antes de migrar todos os controllers para o tratamento padronizado de respostas procura evitar retrabalho. Essa ordem, porém, deve ser guiada por requisitos e contratos previamente definidos: não é necessário concluir todos os repositories para especificar o comportamento esperado da API.

<a id="parte-3-1-2-objetivos"></a>
### 1.2 Objetivos

1. Tornar explícitos os requisitos funcionais e não funcionais.
2. Documentar as regras de negócio e invariantes do domínio.
3. Definir contratos estáveis para API, erros e comunicação entre camadas.
4. Reduzir o acoplamento entre HTTP, regras de negócio e persistência.
5. Adotar testes automatizados como proteção contra regressões.
6. Revisar segurança, autorização e integridade dos dados.
7. Permitir evolução incremental sem reescrita integral do servidor.
8. Manter o cliente Android compatível com os contratos publicados.
9. Manter a documentação sincronizada com o comportamento real do sistema.

---

<a id="parte-4-2-estrat-gia-de-trabalho-requisitos-antes-da-implementa-o"></a>
## 2. Estratégia de trabalho: requisitos antes da implementação

O trabalho será conduzido em etapas incrementais. A sequência geral é:

1. Inventariar o sistema atual e separar o comportamento existente do comportamento desejado.
2. Definir requisitos funcionais e não funcionais.
3. Formalizar regras de domínio e critérios de aceitação.
4. Definir contratos externos e internos.
5. Derivar testes desses contratos e critérios.
6. Implementar um fluxo vertical de cada vez.
7. Validar a integração, atualizar a documentação e avançar para o próximo fluxo.

Essas etapas não precisam ser concluídas globalmente para todo o sistema antes de começar a implementar. A abordagem recomendada é progressiva: definir suficientemente um módulo ou fluxo, implementá-lo, validá-lo e então avançar.

<a id="parte-5-2-1-distinguir-tr-s-fontes-de-verdade"></a>
### 2.1 Distinguir três fontes de verdade

Durante o inventário, classifique cada comportamento como:

- **Comportamento atual:** aquilo que o código realmente faz hoje.
- **Comportamento desejado:** aquilo que os requisitos determinam.
- **Decisão de implementação:** a forma técnica escolhida para satisfazer o requisito.

Não assumir que o comportamento atual está correto apenas porque já está implementado. Inconsistências encontradas devem ser registradas como decisões pendentes ou defeitos a corrigir.

<a id="parte-6-2-2-tipos-de-contrato"></a>
### 2.2 Tipos de contrato

| Tipo | Define | Exemplo |
|---|---|---|
| Contrato externo | Como clientes utilizam a API | Endpoint, autenticação, parâmetros, status HTTP e formato JSON |
| Contrato de domínio | Estados válidos e regras do negócio | Um comentário deve estar vinculado a exatamente um recurso, se essa for a regra aprovada |
| Contrato interno | Como as camadas colaboram | Casos de uso dependem de contratos de persistência, não do Prisma diretamente |
| Contrato de qualidade | Condições para considerar uma mudança concluída | Testes, análise estática, build e critérios de aceitação aprovados |

Os contratos devem ser explícitos, testáveis e versionados. Contratos internos não precisam de um documento isolado para cada classe: podem ser definidos por interfaces, tipos, testes e documentação arquitetural.

---

<a id="parte-7-3-organiza-o-recomendada-da-documenta-o"></a>
## 3. Organização recomendada da documentação

A documentação deve ser versionada junto ao código, por exemplo em `docs/`. A estrutura abaixo é uma proposta inicial e pode ser simplificada de acordo com o conteúdo real.

```text
docs/
  index.md
  requirements/
    requirements.md
    functional-specifications/
    acceptance-criteria.md
  domain/
    domain-model.md
    domain-rules.md
    entity-relationship-diagram.md
  api/
    openapi.yaml
    error-contract.md
    authentication-and-authorization.md
  architecture/
    architecture.md
    dependency-rules.md
    adr/
  development/
    setup.md
    database-and-migrations.md
    testing.md
    contribution-workflow.md
```

<a id="parte-8-3-1-conte-do-de-cada-documento"></a>
### 3.1 Conteúdo de cada documento

| Documento | Conteúdo esperado |
|---|---|
| `requirements.md` | Objetivos, escopo, atores, funcionalidades, restrições e requisitos não funcionais |
| Especificações funcionais | Comportamento de cada fluxo, pré-condições, resultados, falhas e regras de autorização |
| `acceptance-criteria.md` | Condições verificáveis para aceitar cada funcionalidade |
| `domain-model.md` | Entidades, conceitos, responsabilidades e relações do domínio |
| `domain-rules.md` | Invariantes, cardinalidades, políticas e restrições de negócio |
| `entity-relationship-diagram.md` | Diagrama e descrição das relações persistidas |
| `openapi.yaml` | Contrato HTTP consumido pelo cliente Android e por outros clientes |
| `error-contract.md` | Códigos de erro, estrutura dos corpos, status HTTP e exposição de detalhes |
| `authentication-and-authorization.md` | Identidade, credenciais, papéis, permissões e escopo de acesso |
| `architecture.md` | Camadas, fluxo de dependências e responsabilidades |
| `dependency-rules.md` | Dependências permitidas e proibidas entre camadas |
| ADRs | Contexto, alternativas, decisão e consequências de escolhas relevantes |
| `setup.md` | Configuração e execução do projeto |
| `database-and-migrations.md` | Banco, migrations, geração do Prisma Client e estratégia por ambiente |
| `testing.md` | Tipos de teste, isolamento, execução e critérios de qualidade |
| `contribution-workflow.md` | Fluxo de trabalho, convenções e definição de concluído |

<a id="parte-9-3-2-openapi-como-contrato-da-api"></a>
### 3.2 OpenAPI como contrato da API

O contrato HTTP deve especificar, para cada endpoint:

- método e caminho;
- autenticação exigida;
- autorização necessária;
- parâmetros de caminho, query e corpo;
- schemas de entrada e saída;
- códigos HTTP de sucesso e falha;
- formato de erros;
- paginação, ordenação e filtros, quando aplicáveis;
- exemplos relevantes;
- efeitos da operação e requisitos de idempotência, quando necessários.

O OpenAPI deve descrever o comportamento acordado, não simplesmente copiar a implementação atual. Quando a migração exigir mudança incompatível, documentar a mudança e definir como o cliente Kotlin será atualizado.

<a id="parte-10-3-3-architecture-decision-records-adrs"></a>
### 3.3 Architecture Decision Records (ADRs)

Registrar decisões com impacto duradouro, por exemplo:

- adoção de arquitetura em camadas;
- fronteira dos repositories;
- escolha de autenticação;
- estratégia de transações;
- formato de erros;
- política de versionamento da API;
- estratégia de banco e migrations;
- escolha e configuração do test runner.

Cada ADR deve incluir contexto, opções consideradas, decisão, justificativa e consequências. Não é necessário criar ADR para cada detalhe trivial.

---

<a id="parte-11-4-diagn-stico-arquitetural-do-estado-atual"></a>
## 4. Diagnóstico arquitetural do estado atual

<a id="parte-12-4-1-organiza-o-das-responsabilidades"></a>
### 4.1 Organização das responsabilidades

Na versão analisada, alguns controllers executam diretamente operações do Prisma e acumulam validação, coordenação de regras de negócio, persistência e construção de respostas HTTP. `UserController` e `WorkspaceController` já utilizam o tratamento centralizado de exceções em maior medida, enquanto outros controllers mantêm padrões de resposta próprios.

O `UserRepository` é o início da extração da persistência, mas, isoladamente, ainda não define a arquitetura em camadas. A mudança depende de contratos claros e de uma direção de dependências consistente.

<a id="parte-13-problemas-e-a-es"></a>
#### Problemas e ações

| Achado | Consequência | Ação |
|---|---|---|
| Controllers acessam diretamente o Prisma | Acoplamento à infraestrutura e testes de unidade mais difíceis | Encaminhar operações para casos de uso e repositories |
| Controllers coordenam operações com várias regras | Responsabilidades difíceis de isolar e reutilizar | Mover a coordenação para services/use cases |
| Padrões diferentes de tratamento de erro | Contrato HTTP inconsistente | Centralizar a conversão de erros em respostas |
| Inicialização do servidor e Prisma no mesmo módulo | Importar o módulo pode disparar efeitos colaterais em testes | Separar criação do app, configuração de dependências e `listen()` |
| Limites entre camadas ainda não formalizados | Risco de criar pastas sem reduzir acoplamento | Documentar dependências permitidas e verificá-las por revisão/testes |

<a id="parte-14-4-2-arquitetura-de-destino"></a>
### 4.2 Arquitetura de destino

Arquitetura em camadas com MVC na borda HTTP é suficiente para os objetivos atuais. Clean Architecture completa, DDD tático e CQRS não são pré-requisitos.

```text
HTTP / Express
  Routes e middlewares
        |
        v
Controllers
  Adaptam HTTP à aplicação
        |
        v
Use cases / Services
  Coordenam regras e operações
        |
        v
Contratos de repositório
        ^
        |
Implementações Prisma
        |
        v
Banco de dados
```

O fluxo de erro é transversal: erros tipados são propagados até o middleware HTTP, que os converte em status e corpo apropriados.

<a id="parte-15-responsabilidades"></a>
#### Responsabilidades

- **Routes e middlewares:** roteamento, autenticação, validação de fronteira e outras preocupações transversais HTTP.
- **Controllers:** ler a requisição, chamar o caso de uso e construir a resposta HTTP.
- **Use cases/services:** coordenar a operação, aplicar regras de negócio, verificar condições e controlar o limite transacional por meio das abstrações apropriadas.
- **Contratos de repository:** definir operações de persistência de que a aplicação precisa.
- **Repositories Prisma:** encapsular consultas e gravações específicas da infraestrutura.
- **Domínio:** conter entidades, regras ou invariantes que tenham complexidade e identidade próprias, sem ser criado artificialmente para cumprir uma convenção.
- **Middleware de erro:** mapear erros conhecidos para respostas públicas seguras e registrar falhas inesperadas.

<a id="parte-16-aplica-o-de-solid"></a>
#### Aplicação de SOLID

- **SRP:** cada componente deve ter uma responsabilidade coerente.
- **OCP:** permitir extensão sem alterações desnecessárias em código estável; não exigir abstração antecipada para todo caso.
- **LSP:** implementações alternativas de uma interface devem respeitar seu comportamento contratado.
- **ISP:** interfaces devem ser pequenas e orientadas às necessidades reais dos consumidores.
- **DIP:** casos de uso devem depender de abstrações de que precisam, e não diretamente de Express ou Prisma.

SOLID é um critério para reduzir acoplamento, não uma obrigação de criar uma interface para cada classe.

<a id="parte-17-4-3-estrutura-de-diret-rios-poss-vel"></a>
### 4.3 Estrutura de diretórios possível

```text
src/
  app/
    use-cases/
      users/
      workspaces/
      teams/
      tasks/
      objectives/
    errors/
    contracts/
  domain/
    entities/
    rules/
  infrastructure/
    database/
    repositories/
  http/
    controllers/
    routes/
    middlewares/
    schemas/
  shared/
    utils/
  Server.ts

test/
  unit/
  integration/
  e2e/
```

Essa estrutura é ilustrativa. Não criar diretórios vazios ou abstrações artificiais. Se o projeto preferir organizar por funcionalidade, uma estrutura modular por domínio também é válida, desde que as dependências permaneçam explícitas.

---

<a id="parte-18-5-repositories-e-persist-ncia"></a>
## 5. Repositories e persistência

<a id="parte-19-5-1-estado-observado"></a>
### 5.1 Estado observado

`src/repository/UserRepository.ts` contém um `findAll()` que consulta o Prisma e seleciona campos públicos do usuário. É um primeiro passo para retirar a persistência dos controllers.

Pontos identificados no arquivo analisado:

- o repository importa `prisma` diretamente de `Server.ts`;
- o repository converte exceções de forma ampla em um erro de busca da aplicação;
- existe um import de `any` vindo do Zod que não é utilizado;
- os testes existentes cobrem apenas uma parte limitada do comportamento do repository.

<a id="parte-20-5-2-regras-para-a-implementa-o-dos-repositories"></a>
### 5.2 Regras para a implementação dos repositories

1. Não importar o módulo que inicializa o servidor para obter uma conexão.
2. Injetar as dependências necessárias ou usar uma composição explícita de dependências.
3. Definir contratos de repository na camada que os consome, quando houver uma fronteira útil.
4. Manter no repository as consultas, gravações e particularidades de persistência.
5. Não colocar regras de autorização, status HTTP ou formatação de respostas no repository.
6. Não transformar indiscriminadamente todas as exceções do banco em um erro genérico de domínio.
7. Preservar a distinção entre ausência de registro, conflito, falha de persistência e erro inesperado.
8. Usar transações quando uma operação precisar manter a integridade de várias gravações.
9. Selecionar apenas os campos necessários e nunca expor senhas ou hashes nas respostas públicas.
10. Criar métodos específicos que representem consultas úteis ao domínio, evitando repositories genéricos com operações sem significado para a entidade.

<a id="parte-21-5-3-interfaces-quando-criar"></a>
### 5.3 Interfaces: quando criar

Uma interface é justificável quando define uma fronteira real, permite substituir infraestrutura ou facilita testar um caso de uso sem banco.

Opções:

- **Interface por repository:** adequada quando vários casos de uso dependem de um contrato estável.
- **Implementação direta com Prisma:** pode ser aceitável em um módulo pequeno, desde que o acoplamento seja deliberado e os testes não sejam inviabilizados.
- **Falsificações de teste (*fakes*) em vez de mocks detalhados:** úteis quando se deseja testar o comportamento da aplicação com uma implementação simples em memória.

Para este projeto, a recomendação é usar contratos nos limites entre aplicação e persistência onde isso facilite a evolução. Não criar interfaces apenas por convenção.

---

<a id="parte-22-6-casos-de-uso-e-transa-es"></a>
## 6. Casos de uso e transações

A extração de repositories não deve apenas transferir chamadas do Prisma para outra classe. A lógica de coordenação deve ficar na aplicação.

<a id="parte-23-exemplo-cria-o-de-workspace"></a>
### Exemplo: criação de workspace

Fluxo atual observado no `WorkspaceController.create()`:

1. Validar os dados com Zod.
2. Procurar o gerente.
3. Criar o workspace.
4. Criar o vínculo do gerente como membro.
5. Construir a resposta HTTP.
6. Tratar exceções.

Fluxo pretendido:

1. O controller valida a fronteira HTTP e chama `CreateWorkspace`.
2. O caso de uso aplica as regras e verifica as condições necessárias.
3. A camada de persistência grava o workspace e o vínculo inicial do gerente em uma transação.
4. O resultado é devolvido ao controller.
5. O middleware centraliza o tratamento de erros não tratados.

Se a segunda gravação falhar, a transação deve impedir que o workspace permaneça criado sem o vínculo obrigatório. A regra de negócio precisa confirmar que esse vínculo é de fato obrigatório.

A transação pode ser encapsulada por um método de persistência que faça as duas gravações ou por uma abstração transacional própria. Evitar espalhar detalhes de `$transaction` pelos controllers.

<a id="parte-24-outros-fluxos-para-refatorar"></a>
### Outros fluxos para refatorar

- `UserController.create()`: normalização, unicidade de e-mail e criação segura.
- `WorkspaceController.include()`: existência dos envolvidos e autorização do gerente.
- `WorkspaceController.remove()`: permissão para remover membros e comportamento quando o vínculo não existe.
- `TaskController.create()`: validação de status/dificuldade, contexto da tarefa, relacionamentos e permissões.
- Operações de equipes: validação de integrantes, contexto do workspace e autorização.
- Operações de objetivos: validação do workspace e das relações opcionais.

A regra prática é que uma operação que continuaria existindo se Express fosse substituído por outro framework deve estar na camada de aplicação, e não no controller.

---

<a id="parte-25-7-contrato-http-e-tratamento-de-erros"></a>
## 7. Contrato HTTP e tratamento de erros

<a id="parte-26-7-1-situa-o-observada"></a>
### 7.1 Situação observada

`UserController` e `WorkspaceController` já utilizam mais consistentemente o middleware de exceções. `TeamController`, `TaskController` e parte de `ObjectiveController` ainda possuem respostas e tratamentos locais diferentes.

Isso permite que erros equivalentes produzam status ou corpos diferentes entre endpoints.

<a id="parte-27-7-2-pol-tica-recomendada"></a>
### 7.2 Política recomendada

- Centralizar a conversão de exceções em respostas HTTP.
- Evitar `try/catch` repetitivo nos controllers quando o erro puder ser propagado.
- Como o projeto utiliza Express 5, handlers assíncronos podem propagar rejeições de promises ao middleware de erro automaticamente.
- Manter erros esperados identificáveis e erros inesperados seguros.
- Não devolver stack traces, consultas, credenciais ou detalhes internos ao cliente em produção.
- Registrar falhas inesperadas com contexto útil para diagnóstico, sem incluir segredos.
- Não confundir formato padronizado de erro com obrigação de envolver todos os corpos de sucesso no mesmo objeto.

<a id="parte-28-7-3-estrutura-poss-vel-para-erros"></a>
### 7.3 Estrutura possível para erros

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Os dados enviados são inválidos.",
  "details": [],
  "requestId": "identificador-opcional"
}
```

Este é um exemplo de contrato proposto, não uma descrição do formato atual. Definir os campos finais antes de atualizar todos os controllers e o cliente Kotlin.

- `code`: código estável, independente do texto apresentado ao usuário.
- `message`: mensagem legível.
- `details`: detalhes estruturados de validação, quando aplicáveis.
- `requestId`: identificador de correlação, se implementado.

<a id="parte-29-7-4-status-http-de-refer-ncia"></a>
### 7.4 Status HTTP de referência

| Cenário | Status usual |
|---|---:|
| Recurso criado | `201 Created` |
| Consulta ou atualização com corpo | `200 OK` |
| Operação concluída sem corpo | `204 No Content` |
| Entrada inválida | `400 Bad Request` |
| Credenciais ausentes ou inválidas | `401 Unauthorized` |
| Usuário autenticado sem permissão | `403 Forbidden` |
| Recurso não encontrado | `404 Not Found` |
| Conflito de unicidade ou estado | `409 Conflict` |
| Falha inesperada | `500 Internal Server Error` |

O status precisa refletir o contrato definido e ser usado consistentemente. Não retornar `500` para falhas previsíveis de negócio nem usar `400` para qualquer erro.

---

<a id="parte-30-8-tdd-e-estrat-gia-de-testes"></a>
## 8. TDD e estratégia de testes

<a id="parte-31-8-1-estado-observado"></a>
### 8.1 Estado observado

O projeto já contém um teste para `UserRepository`, mas ainda não apresenta uma estratégia abrangente de testes. O `package.json` analisado não define um script `test`, e o código de teste usa o runner nativo do Node.js.

O teste do repository verifica uma parte da chamada ao Prisma e do resultado. Isso é útil, mas não substitui testes de regras de negócio, constraints reais ou contratos HTTP.

<a id="parte-32-8-2-camadas-de-teste"></a>
### 8.2 Camadas de teste

| Tipo | Objetivo | Dependências |
|---|---|---|
| Unitário | Verificar regras e decisões de um caso de uso | Repositories falsos ou mocks de contratos |
| Integração de repository | Verificar consultas, relações, constraints e transações | Banco de teste isolado e Prisma configurado |
| Integração HTTP | Verificar rotas, validação, autenticação, status e corpos | Aplicação HTTP e dependências controladas |
| Ponta a ponta (E2E) | Validar fluxos importantes atravessando as camadas | Ambiente de teste próximo do uso real |

<a id="parte-33-8-3-ciclo-de-tdd"></a>
### 8.3 Ciclo de TDD

1. Escrever um teste para um comportamento desejado.
2. Executar o teste e confirmar que falha pela razão esperada.
3. Implementar a menor mudança que satisfaça o teste.
4. Executar os testes relevantes.
5. Refatorar mantendo o comportamento.
6. Executar a suíte de regressão e os controles de qualidade antes de integrar a mudança.

TDD não é adiar os testes até que toda a arquitetura esteja construída. Os testes devem orientar as alterações desde o primeiro caso de uso.

<a id="parte-34-8-4-primeiro-fluxo-de-refer-ncia"></a>
### 8.4 Primeiro fluxo de referência

`CreateWorkspace` é um candidato inicial porque exercita várias fronteiras:

- validação de entrada;
- existência do gerente;
- regras de negócio;
- gravações relacionadas;
- transação e rollback;
- erros de domínio;
- resposta HTTP.

Cenários iniciais:

- criação válida;
- gerente inexistente;
- dados inválidos;
- falha ao criar o vínculo inicial;
- rollback sem gravação parcial;
- usuário sem permissão;
- formato correto da resposta de sucesso e dos erros.

Depois de validar esse padrão, migrar um fluxo simples, como consulta de usuário, para garantir que a arquitetura não imponha abstrações desnecessárias a operações triviais.

<a id="parte-35-8-5-ambiente-de-testes"></a>
### 8.5 Ambiente de testes

- Não utilizar `dev.db` para testes automatizados.
- Criar e limpar um banco de teste isolado.
- Confirmar a compatibilidade entre a versão do Prisma, o adapter e o provider de teste.
- Separar o carregamento do app do `listen()` para testes HTTP.
- Encerrar conexões e processos corretamente.
- Manter testes independentes da ordem de execução.
- Criar scripts claros para testes unitários, de integração e E2E.

O runner nativo do Node.js pode ser mantido. A troca de ferramenta deve depender de necessidades concretas, não preceder a definição da estratégia de testes.

---

<a id="parte-36-9-modelo-de-dados-e-regras-de-dom-nio"></a>
## 9. Modelo de dados e regras de domínio

O `schema.prisma` contém relacionamentos entre usuários, workspaces, equipes, tarefas, objetivos e comentários. O schema é parte central do contrato de domínio e precisa ser revisado em conjunto com os requisitos.

Os pontos abaixo são decisões a confirmar, não afirmações de que todas as regras atuais estão incorretas.

<a id="parte-37-9-1-opcionalidade-e-cardinalidade"></a>
### 9.1 Opcionalidade e cardinalidade

No schema analisado:

- `Workspace.managerId` é opcional.
- `Team.managerId` é opcional.
- `Task.teamId`, `Task.managerId`, `Task.workspaceId` e `Task.objectiveId` são opcionais.
- `Objective.workspaceId` é obrigatório, mas `managerId` e `teamId` são opcionais.
- `Task` pode ter `workspaceId` e `objectiveId` nulos ou preenchidos simultaneamente, salvo outras restrições não representadas pelo schema.

Para cada relação, definir:

- se é obrigatória ou opcional;
- cardinalidade permitida;
- condições para criar e remover o vínculo;
- política de exclusão;
- comportamento quando o recurso relacionado deixa de existir;
- invariantes que precisam ser garantidas no banco e/ou na aplicação.

Se a tarefa deve pertencer exatamente a um contexto, por exemplo workspace ou objetivo, formalizar a exclusividade. Validar apenas no controller não protege todos os caminhos de escrita.

<a id="parte-38-9-2-gerentes-e-membros"></a>
### 9.2 Gerentes e membros

A criação de workspace registra o gerente também como membro. É necessário confirmar se essa é uma regra obrigatória e se deve valer para equipes.

Decisões a documentar:

- Todo gerente de workspace precisa ser membro?
- O gerente de equipe precisa pertencer ao workspace da equipe?
- Membros de equipe precisam ser membros do workspace correspondente?
- Um usuário pode gerenciar uma equipe sem gerenciar o workspace?
- Quais ações cada papel pode executar?

Essas respostas afetam integridade, autorização, transações e testes.

<a id="parte-39-9-3-coment-rios"></a>
### 9.3 Comentários

`Comment` permite `taskId` e `objectiveId` opcionais. Confirmar se um comentário deve estar associado a exatamente um recurso.

Se sim, impedir comentário sem destino e comentário vinculado simultaneamente aos dois tipos de recurso. Aplicar a regra na aplicação e, quando possível, na persistência.

<a id="parte-40-9-4-enums-e-valida-o"></a>
### 9.4 Enums e validação

Status e dificuldade são representados por enums no TypeScript, mas os campos correspondentes são strings no banco. Isso dá flexibilidade, porém aumenta a dependência da validação da aplicação.

Opções:

- usar enums do Prisma quando compatíveis com o provider e a versão;
- manter strings, com validação centralizada e constraints quando possíveis;
- definir mapeamento explícito entre valores públicos da API e valores internos.

O contrato HTTP precisa documentar os valores aceitos. Conversões numéricas para enums devem ser explícitas, validadas e testadas.

<a id="parte-41-9-5-conven-es-de-nomenclatura"></a>
### 9.5 Convenções de nomenclatura

O schema e as migrações apresentam convenções mistas de nomenclatura, incluindo nomes em português e inglês e formatos distintos de campos.

Definir uma convenção consistente para modelos, campos, relações e migrações. Não executar uma renomeação massiva sem migrações controladas e testes de regressão.

<a id="parte-42-9-6-exclus-es-em-cascata"></a>
### 9.6 Exclusões em cascata

Revisar cada `onDelete: Cascade`, `SetNull` ou outra política configurada.

A exclusão de usuários, workspaces, equipes, tarefas e objetivos pode propagar efeitos para membros, comentários e subtarefas. A política deve ser intencional e documentada, com testes para cenários de exclusão e preservação de dados.

---

<a id="parte-43-10-seguran-a-e-autoriza-o"></a>
## 10. Segurança e autorização

Segurança e integridade devem ser tratadas antes de ampliar a superfície da API ou consolidar os contratos.

<a id="parte-44-10-1-identidade-confi-vel"></a>
### 10.1 Identidade confiável

Em endpoints analisados, parâmetros como `managerId`, `memberId` ou `user` são utilizados em operações ou decisões de acesso.

Por exemplo, `WorkspaceController.include()` compara o `managerId` recebido com o gerente persistido. Isso não prova que a pessoa que fez a requisição seja esse gerente: o cliente pode enviar o ID de outra pessoa.

A identidade do ator deve vir de uma credencial validada pelo servidor. A autorização deve usar essa identidade e as relações persistidas, e não confiar em IDs arbitrários enviados pelo cliente.

O código analisado não demonstra um fluxo completo de emissão e validação de credenciais de autenticação entre login e os demais endpoints. A arquitetura deve definir esse fluxo antes de considerar as políticas de autorização concluídas.

<a id="parte-45-10-2-escopo-das-consultas"></a>
### 10.2 Escopo das consultas

Foram observados comportamentos que merecem revisão:

- `TaskController.tasks()` retorna todas as tarefas quando o parâmetro `user` não é fornecido.
- `GET /team` retorna equipes e membros sem demonstrar, no trecho analisado, um filtro de acesso por usuário ou workspace.
- O controller de objetivos consulta objetivos sem demonstrar, em todos os caminhos, a aplicação de políticas de acesso.

Esses comportamentos podem ser intencionais em determinados contextos, mas precisam ser justificados pelos requisitos. Se os recursos forem privados por workspace, equipe ou usuário, o servidor deve impor esse escopo.

A interface Android não é uma fronteira de segurança.

<a id="parte-46-10-3-consist-ncia-de-autoriza-o"></a>
### 10.3 Consistência de autorização

As operações de equipe não demonstram a mesma abordagem de autorização aplicada em parte das operações de workspace. Também há tratamentos pouco claros para ausência de usuário ou vínculo.

Definir políticas centralizadas ou helpers de autorização bem delimitados, sem criar uma camada genérica excessiva. Os testes devem cobrir:

- ator autorizado;
- ator autenticado sem permissão;
- credencial ausente ou inválida;
- recurso fora do escopo do ator;
- vínculo ou recurso inexistente;
- tentativa de manipular IDs de outros usuários.

<a id="parte-47-10-4-credenciais-e-dados-sens-veis"></a>
### 10.4 Credenciais e dados sensíveis

A criação de usuários utiliza hash de senha, e a exclusão verifica a senha informada. Esses são pontos positivos, mas precisam integrar uma política completa de autenticação.

Verificar:

- nenhuma senha ou hash em respostas públicas;
- nenhuma credencial em logs;
- transporte seguro em produção;
- validação e expiração das credenciais;
- limites de tentativas de login;
- respostas de autenticação que não facilitem enumeração de usuários;
- gestão de segredos por ambiente.

---

<a id="parte-48-11-outros-achados-espec-ficos-da-inspe-o"></a>
## 11. Outros achados específicos da inspeção

Os itens desta seção devem ser confirmados no estado atualizado do repositório antes da correção.

| Arquivo/área | Achado | Ação |
|---|---|---|
| `Server.ts` | O módulo combina inicialização do servidor e instância do Prisma | Separar construção da aplicação, composição de dependências e inicialização HTTP |
| `UserRepository.ts` | Dependência direta de `Server.ts` | Injetar a dependência de persistência |
| `UserRepository.ts` | Conversão ampla de exceções em erro de busca | Preservar categorias de falha e evitar ocultar erros inesperados |
| `WorkspaceController.ts` | Workspace e vínculo do gerente são gravados separadamente | Usar transação se a relação for obrigatória |
| `TeamController.ts` | Tratamento local de erros e respostas diferentes | Adotar o contrato centralizado |
| `ObjectiveController.ts` | Na validação de `create()`, o corpo de erro utiliza um identificador importado de `node:console`, em vez do erro de validação do Zod | Corrigir a origem dos detalhes e testar o contrato |
| `TaskController.ts` | O método `tasks()` imprime o parâmetro `user` no console | Remover log de depuração ou usar logging estruturado sem dados sensíveis |
| `TaskController.ts` | A criação valida exclusividade entre workspace e objetivo, mas não demonstra todas as verificações de pertencimento da equipe ao contexto | Validar relacionamentos e permissões antes da gravação |
| `WorkspaceController.ts` | Nome e descrição são convertidos para minúsculas | Definir política de normalização; preservar capitalização onde fizer sentido |
| `package.json` | Não há script `test` definido; `start` executa `db push` | Criar scripts de teste e rever a estratégia de atualização do schema por ambiente |
| `tsconfig.json` | `strict` está habilitado e `types` está configurado como lista vazia | Verificar a resolução de tipos globais e tipos dos testes no build real |
| Configuração Prisma | São importados `PrismaBetterSqlite3` e `PrismaLibSql`, mas a configuração analisada utiliza apenas `PrismaLibSql` | Remover imports/dependências desnecessários e documentar a configuração real |
| Inicialização de testes | Testes que importam Prisma de `Server.ts` podem disparar efeitos colaterais de inicialização | Separar app e `listen()` e definir encerramento de conexões |

Não corrigir tudo em um único commit. Agrupar mudanças pequenas por objetivo, com testes que comprovem o comportamento.

---

<a id="parte-49-12-integra-o-entre-servidor-e-cliente-android"></a>
## 12. Integração entre servidor e cliente Android

O cliente Kotlin consome os contratos HTTP do servidor. Alterações de arquitetura interna não precisam modificar o cliente se os contratos externos forem preservados.

Definir e documentar:

- formato de datas e fusos horários;
- representação de IDs;
- enumerações e valores aceitos;
- campos opcionais e nulos;
- paginação e ordenação;
- comportamento de autenticação e renovação de credenciais, se aplicável;
- códigos e formato de erros;
- semântica de atualização e exclusão;
- compatibilidade de versões.

O OpenAPI deve funcionar como referência comum. Mudanças incompatíveis precisam ser identificadas antes de alterar o servidor e acompanhadas de atualização do cliente.

O formato de erro deve ser especialmente estável: o cliente Android precisa poder tomar decisões a partir de `code` e do status HTTP, sem depender exclusivamente de textos de mensagens.

---

<a id="parte-50-13-plano-de-execu-o-por-fases"></a>
## 13. Plano de execução por fases

<a id="parte-51-fase-1-invent-rio-e-requisitos"></a>
### Fase 1 — Inventário e requisitos

**Entregas:**
- lista de endpoints e comportamentos existentes;
- inventário de entidades e relacionamentos;
- requisitos funcionais e não funcionais;
- lista de inconsistências e decisões pendentes;
- separação entre comportamento atual e desejado.

**Critério de conclusão:** cada funcionalidade relevante possui um objetivo claro, regras conhecidas e pendências identificadas.

<a id="parte-52-fase-2-regras-de-dom-nio-e-crit-rios-de-aceita-o"></a>
### Fase 2 — Regras de domínio e critérios de aceitação

**Entregas:**
- regras de negócio;
- cardinalidades e invariantes;
- políticas de autorização;
- critérios de aceitação por fluxo;
- cenários de falha e integridade.

**Critério de conclusão:** as regras críticas podem ser verificadas sem depender de detalhes da implementação.

<a id="parte-53-fase-3-contratos"></a>
### Fase 3 — Contratos

**Entregas:**
- contrato OpenAPI;
- contrato de erros;
- contrato de autenticação/autorização;
- limites e regras de dependência das camadas;
- ADRs para decisões relevantes.

**Critério de conclusão:** servidor e cliente possuem um contrato externo claro, e as camadas têm responsabilidades definidas.

<a id="parte-54-fase-4-infraestrutura-de-testes-e-seguran-a"></a>
### Fase 4 — Infraestrutura de testes e segurança

**Entregas:**
- app Express testável sem iniciar o servidor;
- banco de teste isolado;
- scripts reproduzíveis;
- testes HTTP básicos;
- revisão de identidade, autorização e operações transacionais prioritárias.

**Critério de conclusão:** testes podem ser executados sem alterar o banco de desenvolvimento e as regras de acesso críticas possuem cobertura inicial.

<a id="parte-55-fase-5-fluxo-vertical-de-refer-ncia"></a>
### Fase 5 — Fluxo vertical de referência

**Fluxo recomendado:** criação de workspace.

**Entregas:**
- caso de uso;
- contratos de persistência necessários;
- implementação Prisma;
- transação;
- tratamento padronizado de erros;
- testes unitários, de integração e HTTP.

**Critério de conclusão:** o fluxo atende aos requisitos e critérios de aceitação, sem dependência do Prisma nos controllers ou do Express no caso de uso.

<a id="parte-56-fase-6-expans-o-incremental"></a>
### Fase 6 — Expansão incremental

Migrar os fluxos de usuários, equipes, tarefas, objetivos e comentários conforme dependências e riscos.

Para cada fluxo:

1. rever requisitos e critérios;
2. escrever ou atualizar testes;
3. implementar a separação de responsabilidades;
4. preservar ou versionar o contrato HTTP;
5. executar testes de regressão;
6. atualizar documentação e ADRs quando necessário.

<a id="parte-57-fase-7-consolida-o"></a>
### Fase 7 — Consolidação

**Entregas:**
- suíte de regressão;
- documentação sincronizada;
- política de migrations definida;
- validação de build e lint;
- revisão final de segurança e compatibilidade Android.

**Critério de conclusão:** o comportamento documentado corresponde à implementação, e as mudanças arquiteturais são protegidas por testes reproduzíveis.

---

<a id="parte-58-14-prioriza-o"></a>
## 14. Priorização

A ordem de prioridade deve considerar risco de segurança, integridade de dados, impacto externo e dependências entre tarefas.

| Prioridade | Trabalho | Justificativa |
|---|---|---|
| P0 | Confirmar identidade e autorização dos endpoints | Evitar acesso ou alteração indevida de recursos |
| P0 | Revisar integridade e transações em operações relacionadas | Evitar estado parcial ou relações inválidas |
| P1 | Inventariar requisitos, regras e contratos | Evitar refatorar comportamento ambíguo |
| P1 | Separar app HTTP da inicialização do processo | Habilitar testes de integração confiáveis |
| P1 | Definir contrato de erros | Manter consistência e compatibilidade com Kotlin |
| P1 | Implementar o primeiro caso de uso completo com TDD | Validar o padrão arquitetural antes de replicá-lo |
| P2 | Migrar controllers restantes | Uniformizar responsabilidades e respostas |
| P2 | Ampliar testes de integração e E2E | Detectar regressões entre camadas |
| P2 | Formalizar OpenAPI, ADRs e documentação do domínio | Manter contratos e decisões rastreáveis |
| P3 | Padronizar nomenclaturas e limpar imports/configurações | Reduzir ruído de manutenção após as correções de maior risco |

P0 e P1 devem ser refinados depois do inventário. Uma falha concreta de autorização ou integridade deve ser corrigida imediatamente, mesmo que a documentação do módulo ainda não esteja concluída.

---

<a id="parte-59-15-defini-o-de-conclu-do-definition-of-done"></a>
## 15. Definição de concluído (Definition of Done)

Uma funcionalidade só deve ser considerada concluída quando os critérios aplicáveis forem atendidos:

- [ ] Requisitos e regras de negócio estão documentados.
- [ ] Critérios de aceitação cobrem sucesso e falhas relevantes.
- [ ] Contrato externo está atualizado, quando a API é afetada.
- [ ] Autenticação e autorização são verificadas no servidor.
- [ ] Regras de integridade e transações estão implementadas.
- [ ] Controllers não contêm regras de negócio complexas nem consultas diretas ao Prisma.
- [ ] Erros são convertidos para o contrato HTTP definido.
- [ ] Testes unitários e de integração pertinentes passam.
- [ ] Testes de regressão e build passam.
- [ ] Nenhum dado sensível é exposto em respostas ou logs.
- [ ] Documentação e ADRs são atualizados quando uma decisão ou contrato muda.
- [ ] Compatibilidade com o cliente Android foi verificada quando necessário.

Nem todos os itens se aplicam a toda alteração. A revisão deve justificar explicitamente qualquer item relevante que não possa ser atendido.

---

<a id="parte-60-16-diretrizes-para-evitar-retrabalho"></a>
## 16. Diretrizes para evitar retrabalho

1. **Não documentar detalhes internos como se fossem requisitos.** Requisitos descrevem o comportamento; arquitetura descreve como organizar a solução.
2. **Não construir todos os repositories antes de validar o padrão.** Usar um fluxo representativo, revisar e depois expandir.
3. **Não centralizar todos os erros dentro dos repositories.** A persistência traduz falhas técnicas quando necessário; a aplicação interpreta resultados; o middleware define a resposta HTTP.
4. **Não criar interfaces sem um limite útil.** Cada abstração deve reduzir acoplamento ou facilitar testes.
5. **Não fazer refatorações massivas sem proteção.** Preferir mudanças pequenas com testes e commits isolados.
6. **Não presumir que o comportamento atual é o desejado.** Registrar divergências e resolver por requisitos.
7. **Não confiar no cliente para impor segurança.** Identidade e autorização são verificadas no servidor.
8. **Não deixar a documentação divergir do contrato implementado.** Tratar mudanças de contrato como parte da tarefa.
9. **Não exigir uma reescrita completa.** A migração pode ocorrer endpoint por endpoint e caso de uso por caso de uso.
10. **Não confundir cobertura de linhas com cobertura de comportamento.** Priorizar invariantes, permissões, falhas e transações.

---

<a id="parte-61-17-pr-ximos-passos-imediatos"></a>
## 17. Próximos passos imediatos

1. Criar `docs/` e um índice que explique a organização dos documentos.
2. Inventariar todos os endpoints e associá-los às entidades e regras que utilizam.
3. Escrever o documento de requisitos, separando requisitos confirmados de questões pendentes.
4. Formalizar as regras de domínio que afetam permissões, cardinalidade, exclusividade e exclusão.
5. Definir critérios de aceitação para o fluxo de criação de workspace.
6. Estabelecer o contrato de erros e o esqueleto OpenAPI.
7. Preparar o ambiente de testes e separar a inicialização HTTP.
8. Implementar `CreateWorkspace` como primeiro fluxo vertical, usando TDD.
9. Avaliar o padrão resultante antes de aplicá-lo às demais entidades.
10. Manter a documentação atualizada ao longo de cada migração.

<a id="parte-62-18-resultado-esperado"></a>
## 18. Resultado esperado

Ao final desse processo, o projeto deverá possuir:

- requisitos e regras de negócio explícitos;
- contratos HTTP estáveis para o cliente Kotlin;
- responsabilidades claras entre controllers, casos de uso e persistência;
- tratamento consistente de erros;
- integridade transacional nas operações que exigem atomicidade;
- autorização baseada em identidade confiável e regras do domínio;
- testes unitários, de integração e E2E nos fluxos relevantes;
- documentação arquitetural com decisões rastreáveis;
- um processo incremental de evolução que não dependa de reescritas integrais.

O princípio de condução é **especificar o comportamento, formalizar o contrato, verificar por testes e implementar em incrementos pequenos**. A arquitetura deve servir a esses objetivos, não se tornar um objetivo independente.
