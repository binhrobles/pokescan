# Pokémon Sprites

This directory should contain 96x96px PNG sprite images for all 151 Generation 1 Pokémon.

## File naming convention

Files should be named `001.png` through `151.png` (zero-padded 3 digits).

## Recommended source

You can download official Pokémon sprites from:
- [PokeAPI Sprites](https://github.com/PokeAPI/sprites) - `/sprites/pokemon/` directory
- [Veekun](https://veekun.com/dex/downloads) - Gen 1 sprites

## Quick download script

```bash
# Download from PokeAPI (requires curl)
for i in {1..151}; do
  curl -o "$(printf "%03d.png" $i)" \
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/$i.png"
done
```

Once downloaded, the app will display sprites in the detail view.
