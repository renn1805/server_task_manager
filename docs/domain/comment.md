# Comment

## O que é

Comentário escrito por um [User](user.md) em uma [Task](task.md) ou em um [Objective](objective.md). Analogia: a conversa na margem da tarefa.

A entidade existe no banco, mas **nenhuma funcionalidade a usa ainda**.

## Campos

| Campo | Obrigatório | Significado |
|-------|-------------|-------------|
| `id` | Sim | Identificador gerado pelo servidor (7 caracteres). |
| `content` | Sim | Texto do comentário. |
| `createdAt` | Sim | Data de criação, automática. |
| `authorId` | Sim | O User que escreveu. |
| `taskId` | Não | Task comentada. |
| `objectiveId` | Não | Objective comentado. |

## Relacionamentos

| Relação | Cardinalidade | Ao excluir |
|---------|---------------|------------|
| Autor ([User](user.md)) | 1 | Excluir o User **exclui** o Comment. |
| [Task](task.md) | 0..1 | Excluir a Task **exclui** o Comment. |
| [Objective](objective.md) | 0..1 | Excluir o Objective **exclui** o Comment. |

O banco permite um Comment sem Task e sem Objective, ou com os dois.

## Regras

| Regra | Situação |
|-------|----------|
| Nenhuma regra está implementada. | Atual |
| Não há data de edição: o conteúdo não foi pensado para ser alterado. | Atual |

## Pendências

| Código | Dúvida |
|--------|--------|
| CMT-P1 | Um Comment deve pertencer a **exatamente um** entre Task e Objective? |
| CMT-P2 | Quem pode editar e excluir: só o autor? O gerente também? |
| CMT-P3 | Quem pode comentar: qualquer Workspace Member ou só quem tem relação com a Task? |
| CMT-P4 | Haverá respostas a comentários (conversa em fios)? |
| CMT-P5 | Ao excluir um User, os Comments dele somem. Manter o histórico com autor "removido"? |
