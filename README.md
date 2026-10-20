# OPEN BAGRE CUP

Site do campeonato de CS2 OPEN BAGRE CUP: times, jogadores, fase de grupos (todos contra todos, 3 pontos por vitória, desempate por saldo de rounds) e mata-mata (play-in, semifinais, final e disputa de 3º lugar).

## Como usar
É um site estático em um único arquivo: `index.html`. Abra no navegador ou publique com o GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

## Como editar os dados
Os times, jogadores e resultados ficam em JSON dentro do `index.html`, na tag `<script type="application/json" id="state">`:

- `teams`: lista de times (`id`, `n` = nome, `p` = jogadores com `k` = nick e `c` = capitão).
- `res`: placar em rounds da fase de grupos, chave `idTimeA|idTimeB` e valor `[roundsA, roundsB]`.
- `ko`: placar do mata-mata (`playin`, `semi1`, `semi2`, `final`, `third`).

Obs.: o botão "Editar site" (painel de administrador) só funciona quando a página está hospedada como artefato do Claude. Fora dele, edite o JSON acima direto no arquivo.
