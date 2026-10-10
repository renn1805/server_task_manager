# Documentação do Task Manager (Servidor)

Índice da documentação do servidor (TypeScript, Express 5, Prisma). Texto em pt-BR; nomes de arquivo em inglês.

## Como ler

Siga esta ordem. Cada etapa se apoia na anterior.

| # | Área | O que contém | Status |
|---|------|--------------|--------|
| 1 | [Requisitos](requirements/) | O que o sistema deve fazer e por quê | Planejado |
| 2 | [Especificações funcionais](requirements/functional-specifications/) | Detalhe de cada funcionalidade, uma por arquivo | Planejado |
| 3 | [Domínio](domain/) | Entidades, regras de negócio e vocabulário do projeto | Em andamento |
| 3.1 | [Visão geral do domínio](domain/overview.md) | Termos, diagrama de relacionamentos e pendências gerais | Em andamento |
| 3.2 | [User](domain/user.md) | Pessoa com conta no sistema | Em andamento |
| 3.3 | [Workspace](domain/workspace.md) | Espaço onde um projeto é organizado | Em andamento |
| 3.4 | [Workspace Member](domain/workspace-member.md) | Vínculo entre User e Workspace | Em andamento |
| 3.5 | [Team](domain/team.md) | Grupo de pessoas dentro de um Workspace | Em andamento |
| 3.6 | [Team Member](domain/team-member.md) | Vínculo entre User e Team | Em andamento |
| 3.7 | [Objective](domain/objective.md) | Meta do Workspace que agrupa Tasks | Em andamento |
| 3.8 | [Task](domain/task.md) | Unidade de trabalho, com subtasks | Em andamento |
| 3.9 | [Comment](domain/comment.md) | Comentário em Task ou Objective | Em andamento |
| 4 | [API](api/) | Inventário de endpoints, entradas e saídas | Planejado |
| 5 | [Arquitetura](architecture/) | Visão geral de como o servidor é organizado | Planejado |
| 6 | [Decisões de arquitetura (ADR)](architecture/adr/) | Registro das decisões técnicas e do motivo de cada uma | Planejado |
| 7 | [Desenvolvimento](development/) | Como rodar, testar e contribuir | Planejado |

## Status dos documentos

- **Planejado**: a pasta existe, o conteúdo ainda não.
- **Em andamento**: o documento existe, mas está incompleto.
- **Pronto**: revisado e coerente com o código.

## Status dos itens dentro de cada documento

Cada item (endpoint, regra, requisito) recebe uma destas marcas:

- **Atual**: o que o código faz hoje.
- **Desejado**: o que o requisito manda.
- **Pendente**: decisão ainda em aberto.

Quando "Atual" e "Desejado" forem diferentes, o item aparece com as duas marcas, e a diferença é o trabalho a fazer.

## Como atualizar este índice

Cada arquivo criado dentro de uma área é um subtópico dela. Ao criar um arquivo:

1. Adicione uma linha logo abaixo da área, numerada com o número da área + subnúmero sequencial (ex.: os arquivos da área `4` viram `4.1`, `4.2`, `4.3`...).
2. Coloque o link para o arquivo (não mais para a pasta) e uma linha dizendo o que ele contém.
3. Defina o status do arquivo (Planejado, Em andamento ou Pronto).

Mudou o estado de um documento? Atualize só a coluna **Status**.
