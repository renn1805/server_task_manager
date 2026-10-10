# Team

## O que é

Grupo de pessoas dentro de um [Workspace](workspace.md). Analogia: um departamento da empresa. Pode ser responsável por Tasks e Objectives.

## Campos

| Campo | Obrigatório | Significado |
|-------|-------------|-------------|
| `id` | Sim | Identificador gerado pelo servidor (9 caracteres). |
| `name` | Sim | Nome da Team. |
| `description` | Não | Descrição. |
| `workspaceId` | Sim | Workspace a que a Team pertence. |
| `managerId` | Não | Gerente da Team. |

## Relacionamentos

| Relação | Cardinalidade | Ao excluir |
|---------|---------------|------------|
| [Workspace](workspace.md) | 1 | Excluir o Workspace **exclui** a Team. |
| Gerente ([User](user.md)) | 0..1 | Excluir o User deixa a Team **sem gerente**. |
| Membros ([Team Member](team-member.md)) | 0..N | Excluir a Team exclui os vínculos. |
| [Task](task.md) | 0..N | Excluir a Team deixa as Tasks **sem Team**. |
| [Objective](objective.md) | 0..N | Excluir a Team deixa os Objectives **sem Team**. |

## Regras

| Regra | Situação |
|-------|----------|
| Nome e descrição são salvos como enviados, sem conversão para minúsculas. | Atual |
| Criar não confere se o Workspace e o gerente existem, nem se o gerente é membro do Workspace. | Atual |
| A listagem devolve as Teams de **todos** os Workspaces. | Atual |
| Só o gerente da Team remove membros. | Atual |
| Não é possível consultar por id, alterar nem excluir uma Team. | Atual |

## Pendências

| Código | Dúvida |
|--------|--------|
| TEM-P1 | Quem pode criar uma Team (só o gerente do Workspace)? O gerente da Team precisa ser Workspace Member? |
| TEM-P2 | Uma Team pode ficar sem gerente? |
| TEM-P3 | O nome da Team deve ser único dentro do Workspace? |
| TEM-P4 | Ao excluir uma Team, as Tasks e Objectives dela devem ficar sem Team, ser reatribuídos ou bloquear a exclusão? |
