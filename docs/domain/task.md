# Task

## O que é

Unidade de trabalho. Pertence a um [Workspace](workspace.md) ou a um [Objective](objective.md), pode ter responsável, Team e **subtasks** (Tasks dentro de Tasks).

## Campos

| Campo | Obrigatório | Significado |
|-------|-------------|-------------|
| `id` | Sim | Identificador gerado pelo servidor (9 caracteres). |
| `title` | Sim | Título (máximo de 50 caracteres pela API). |
| `description` | Sim | Descrição. |
| `status` | Sim | `Pending`, `In Progress` ou `Finished`. |
| `difficulty` | Sim | `Undefined`, `Easy`, `Medium` ou `Hard`. |
| `createdAt` | Sim | Data de criação, automática. |
| `completedAt` | Não | Data de conclusão. |
| `workspaceId` | Não | Workspace, quando a Task é direta. |
| `objectiveId` | Não | Objective, quando a Task pertence a um. |
| `teamId` | Não | Team responsável. |
| `parentId` | Não | Task pai, quando é uma subtask. |
| `managerId` | Não | Responsável pela Task. |

## Relacionamentos

| Relação | Cardinalidade | Ao excluir |
|---------|---------------|------------|
| [Workspace](workspace.md) | 0..1 | Excluir o Workspace **exclui** a Task. |
| [Objective](objective.md) | 0..1 | Excluir o Objective **exclui** a Task. |
| [Team](team.md) | 0..1 | Excluir a Team deixa a Task **sem Team**. |
| Responsável ([User](user.md)) | 0..1 | Excluir o User deixa a Task **sem responsável**. |
| Task pai | 0..1 | Excluir o pai **exclui** as subtasks. |
| Subtasks | 0..N | |
| [Comment](comment.md) | 0..N | Excluir a Task exclui os Comments. |

O banco permite uma Task sem Workspace e sem Objective, ou com os dois. A API, na criação, exige **exatamente um** dos dois.

## Regras

| Regra | Situação |
|-------|----------|
| Título e descrição são salvos em minúsculas. | Atual |
| Na criação, `status` (0 a 2) e `difficulty` (0 a 3) chegam como número e são convertidos para texto. | Atual |
| Na criação, a API exige Team e responsável, embora o banco os trate como opcionais. | Atual |
| Excluir uma Task exclui suas subtasks e Comments. | Atual |
| Listar por User devolve as Tasks em que ele é o responsável ou cuja Team o tem como Team Member. Sem filtro, devolve **todas** as Tasks. | Atual |
| Não existe como alterar o `status` nem concluir uma Task, e `completedAt` nunca é preenchido. | Atual |
| Subtasks existem no banco (`parentId`), sem nenhuma forma de criá-las pela API. | Atual |

## Pendências

| Código | Dúvida |
|--------|--------|
| TSK-P1 | Task direta no Workspace e Task dentro de um Objective: as duas formas continuam? |
| TSK-P2 | Quem é o responsável: uma pessoa, uma Team ou os dois? Pode haver vários responsáveis? |
| TSK-P3 | Quais mudanças de `status` são permitidas (pode voltar de `Finished` para `In Progress`)? E como `completedAt` acompanha o `status`? (ver GEN-P1) |
| TSK-P4 | Subtasks: qual a profundidade máxima? Herdam Workspace, Objective e Team do pai? O pai pode ser concluído com subtasks abertas? |
| TSK-P5 | Quem pode criar, alterar e excluir uma Task: o gerente do Workspace, o da Team, o responsável? |
| TSK-P6 | O limite de 50 caracteres do título é regra de negócio? Vale também para Objective? |
