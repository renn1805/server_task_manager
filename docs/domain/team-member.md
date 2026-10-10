# Team Member

## O que é

Vínculo entre um [User](user.md) e uma [Team](team.md): "este User participa desta Team". Analogia: o crachá do departamento.

No banco, a tabela se chama `TeamsMembers`.

## Campos

| Campo | Obrigatório | Significado |
|-------|-------------|-------------|
| `id` | Sim | Identificador gerado pelo servidor (8 caracteres). |
| `memberId` | Sim | O User que participa. |
| `teamId` | Sim | A Team de que participa. |
| `nameMember` | Sim | Cópia do nome do User, feita na inclusão. Padrão `unknown`. |

## Relacionamentos

| Relação | Cardinalidade | Observação |
|---------|---------------|------------|
| [User](user.md) | 1 | Excluir o User exclui o vínculo. |
| [Team](team.md) | 1 | Excluir a Team exclui o vínculo. |

Um User só pode ter **um** vínculo por Team (restrição de unicidade).

## Regras

| Regra | Situação |
|-------|----------|
| Incluir um membro não exige ser gerente: a regra não existe. | Atual |
| A inclusão não confere se o User existe nem se ele é membro do Workspace da Team. | Atual |
| Só o gerente da Team remove membros. | Atual |
| O nome é copiado do User na inclusão e não é atualizado depois. | Atual |

## Pendências

| Código | Dúvida |
|--------|--------|
| TMB-P1 | Só Workspace Members podem entrar numa Team? |
| TMB-P2 | Quem pode incluir membros: o gerente da Team, o do Workspace, ou ambos? |
| TMB-P3 | Mesma dúvida do `nameMember` do Workspace Member (WMB-P1): manter a cópia ou ler do User? |
| TMB-P4 | O mesmo User pode estar em várias Teams do mesmo Workspace? Hoje pode. |
