function generateCard(pokemon) {
    const typeClass = `type-${pokemon.types[0].type.name}`;
    return `
        <div class="pokemon-card ${typeClass}" onclick="showOverlay(${
        pokemon.id
    })">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${capitalize(pokemon.name)}</h3>
            <p>Typ: ${pokemon.types
                .map((t) => capitalize(t.type.name))
                .join(", ")}</p>
            <small>#${pokemon.id}</small>
        </div>
    `;
}

function generateOverlayHTML(pokemon, stats) {
    return `
        <img src="${
            pokemon.sprites.other["official-artwork"].front_default
        }" alt="${pokemon.name}">
        <h2>${capitalize(pokemon.name)} (#${pokemon.id})</h2>
        <p>Typ: ${pokemon.types
            .map((t) => capitalize(t.type.name))
            .join(", ")}</p>
        <p><strong>HP:</strong> ${stats.hp}</p>
        <p><strong>Angriff:</strong> ${stats.attack}</p>
        <p><strong>Verteidigung:</strong> ${stats.defense}</p>
    `;
}
