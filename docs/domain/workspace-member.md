# Workspace Member

## O que é

Vínculo entre um [User](user.md) e um [Workspace](workspace.md): "este User participa deste Workspace". Analogia: o crachá que dá acesso à empresa.

No banco, a tabela se chama `WorkspaceMember`.

## Campos

| Campo | Obrigatório | Significado |
|-------|-------------|-------------|
| `id` | Sim | Identificador gerado pelo servidor (8 caracteres). |
| `memberId` | Sim | O User que participa. |
| `workspaceId` | Sim | O Workspace de que participa. |
| `nameMember` | Sim | Cópia do nome do User, feita na inclusão. Padrão `unknown`. |

## Relacionamentos

| Relação | Cardinalidade | Observação |
|---------|---------------|------------|
| [User](user.md) | 1 | Excluir o User exclui o vínculo. |
| [Workspace](workspace.md) | 1 | Excluir o Workspace exclui o vínculo. |

Um User só pode ter **um** vínculo por Workspace (restrição de unicidade).

## Regras

| Regra | Situação |
|-------|----------|
| O gerente entra como membro automaticamente na criação do Workspace. | Atual |
| Só o gerente inclui e remove membros. | Atual |
| O nome é copiado do User no momento da inclusão e não é atualizado depois. | Atual |
| Remover o vínculo não mexe nos Team Members, Tasks e Objectives desse User no Workspace. | Atual |
| Incluir quem já é membro viola a restrição de unicidade. | Atual |

## Pendências

| Código | Dúvida |
|--------|--------|
| WMB-P1 | Manter a cópia `nameMember` (e atualizá-la quando o User mudar de nome) ou sempre ler o nome do User? |
| WMB-P2 | Ao remover um membro, o que acontece com os Team Members e as Tasks sob responsabilidade dele? |
| WMB-P3 | A inclusão é direta ou deve haver convite com aceite? |
| WMB-P4 | O próprio membro pode sair do Workspace? |
| WMB-P5 | Haverá papéis além de gerente e membro? |
