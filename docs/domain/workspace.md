# Workspace

## O que é

Espaço onde um projeto é organizado. Reúne os membros, as Teams, os Objectives e as Tasks do projeto. Tem um gerente (um [User](user.md)).

## Campos

| Campo | Obrigatório | Significado |
|-------|-------------|-------------|
| `id` | Sim | Identificador gerado pelo servidor (9 caracteres). |
| `project_name` | Sim | Nome do projeto. |
| `description` | Sim | Descrição do projeto. |
| `createdAt` | Sim | Data de criação, preenchida automaticamente. |
| `completedAt` | Não | Data de conclusão. Vazio enquanto o projeto não foi concluído. |
| `managerId` | Não | Gerente do Workspace. |

## Relacionamentos

| Relação | Cardinalidade | Ao excluir o Workspace |
|---------|---------------|------------------------|
| Gerente ([User](user.md)) | 0..1 | (excluir o User **exclui** o Workspace) |
| Membros ([Workspace Member](workspace-member.md)) | 0..N | Excluídos. |
| [Team](team.md) | 0..N | Excluídas. |
| [Objective](objective.md) | 0..N | Excluídos. |
| [Task](task.md) direta, sem Objective | 0..N | Excluídas. |

## Regras

| Regra | Situação |
|-------|----------|
| Nome e descrição são salvos em minúsculas. | Atual |
| Quem cria vira gerente e é inserido como Workspace Member. Os dois passos não são atômicos: se o segundo falhar, o Workspace fica sem o gerente como membro. | Atual |
| Só o gerente adiciona e remove membros. O servidor compara o `managerId` enviado com o do Workspace. | Atual |
| Só o gerente exclui o Workspace. | Atual |
| Concluir apenas preenche `completedAt`. Não confere quem pediu nem se já estava concluído. | Atual |
| A listagem devolve os Workspaces onde o User informado é membro. | Atual |

## Pendências

| Código | Dúvida |
|--------|--------|
| WSP-P1 | Um Workspace pode existir sem gerente? O campo é opcional no banco, mas excluir o gerente exclui o Workspace. |
| WSP-P2 | Quem pode concluir? Pode reabrir? Um Workspace concluído bloqueia a criação de novas Tasks? |
| WSP-P3 | Pode haver mais de um gerente? O gerente pode ser trocado? |
| WSP-P4 | O gerente pode se remover dos membros? Hoje nada impede, e ele continua gerente sem ser membro. |
| WSP-P5 | O Workspace nunca deve existir sem o gerente como membro? Isso exigiria criar os dois de forma atômica. |
| WSP-P6 | O nome do projeto deve ser único (globalmente ou por gerente)? |
