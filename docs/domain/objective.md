# Objective

## O que é

Meta dentro de um [Workspace](workspace.md). Agrupa [Tasks](task.md) que contribuem para ela. Analogia: a meta do trimestre, com as tarefas que a realizam.

## Campos

| Campo | Obrigatório | Significado |
|-------|-------------|-------------|
| `id` | Sim | Identificador gerado pelo servidor (9 caracteres). |
| `title` | Sim | Título. |
| `description` | Sim | Descrição. |
| `status` | Sim | `Pending`, `In Progress` ou `Finished`. |
| `difficulty` | Sim | `Undefined`, `Easy`, `Medium` ou `Hard`. |
| `createdAt` | Sim | Data de criação, automática. |
| `completedAt` | Não | Data de conclusão. |
| `workspaceId` | Sim | Workspace a que pertence. |
| `managerId` | Não | Responsável pelo Objective. |
| `teamId` | Não | Team responsável. |

## Relacionamentos

| Relação | Cardinalidade | Ao excluir |
|---------|---------------|------------|
| [Workspace](workspace.md) | 1 | Excluir o Workspace **exclui** o Objective. |
| Responsável ([User](user.md)) | 0..1 | Excluir o User deixa o Objective **sem responsável**. |
| [Team](team.md) | 0..1 | Excluir a Team deixa o Objective **sem Team**. |
| [Task](task.md) | 0..N | Excluir o Objective **exclui** as Tasks. |
| [Comment](comment.md) | 0..N | Excluir o Objective exclui os Comments. |

## Regras

| Regra | Situação |
|-------|----------|
| Na criação, o cliente envia `status` (0 a 2) e `difficulty` (0 a 3) como número, e o servidor converte para o texto. | Atual |
| Concluir só preenche `completedAt`. Não muda o `status`. | Atual |
| A listagem devolve os Objectives de **todos** os Workspaces. | Atual |
| Criar não confere se Workspace, responsável e Team existem, nem se a Team é do mesmo Workspace. | Atual |
| Não é possível consultar por id, alterar nem excluir. | Atual |

## Pendências

| Código | Dúvida |
|--------|--------|
| OBJ-P1 | Qual é a fonte da verdade da conclusão: `status` ou `completedAt`? (ver GEN-P1) |
| OBJ-P2 | Um Objective pode ser concluído com Tasks abertas? Ele conclui sozinho quando todas as Tasks terminam? |
| OBJ-P3 | A Team do Objective deve ser sempre do mesmo Workspace? |
| OBJ-P4 | A dificuldade do Objective é um valor próprio ou derivado das Tasks? |
| OBJ-P5 | Excluir um Objective apaga todas as Tasks dele. Confirma, ou elas devem ser movidas para o Workspace? |
