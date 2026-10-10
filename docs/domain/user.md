# User

## O que é

Pessoa com conta no sistema. É o ponto de partida de tudo: um User cria Workspaces, participa deles e das Teams, é responsável por Tasks e escreve Comments.

## Campos

| Campo | Obrigatório | Significado |
|-------|-------------|-------------|
| `id` | Sim | Identificador gerado pelo servidor (11 caracteres). |
| `name` | Sim | Nome do User. |
| `email` | Sim | E-mail. Único no sistema. |
| `password` | Sim | Senha, guardada só como hash (bcrypt). Nunca é devolvida. |

## Relacionamentos

| Relação | Cardinalidade | Ao excluir o User |
|---------|---------------|-------------------|
| Gerencia Workspaces | 0..N | Os Workspaces dele são **excluídos**. |
| Participa de Workspaces ([Workspace Member](workspace-member.md)) | 0..N | Os vínculos são excluídos. |
| Gerencia Teams | 0..N | A Team continua, **sem gerente**. |
| Participa de Teams ([Team Member](team-member.md)) | 0..N | Os vínculos são excluídos. |
| É responsável por Tasks e Objectives | 0..N | Eles continuam, **sem responsável**. |
| Escreve Comments | 0..N | Os Comments são **excluídos**. |

## Regras

| Regra | Situação |
|-------|----------|
| O e-mail é único e salvo em minúsculas. | Atual |
| A senha tem no mínimo 8 caracteres e é guardada com hash. | Atual |
| O nome é salvo em minúsculas. | Atual |
| O login recebe e-mail e senha e devolve `id`, `name` e `email`. Não existe token nem sessão. | Atual |
| Excluir a conta exige e-mail e senha. | Atual |
| Só `id`, `name` e `email` são expostos. | Atual |

## Pendências

| Código | Dúvida |
|--------|--------|
| USR-P1 | Como o servidor passa a saber quem está chamando? Hoje o cliente envia o próprio `id` e o servidor confia. É preciso definir token ou sessão. |
| USR-P2 | Excluir um User apaga os Workspaces que ele gerencia, inclusive os que têm outros membros. É isso mesmo que se quer? |
| USR-P3 | Qualquer um lista todos os Users e e-mails. Quem pode procurar outros Users, e por qual critério? |
| USR-P4 | O User poderá alterar nome, e-mail e senha? Mudar o e-mail exige confirmação? |
