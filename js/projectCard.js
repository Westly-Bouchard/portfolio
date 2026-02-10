const dataPath = "/assets/markdown";

// Assumes that the most recent project file is first
const dataFiles = [
    "open-holonomics",
    "encoder-pcb",
    "driver-interface",
    // "transit-modeling",
    // "makerspace-analysis",
    "pen-plotter",
    "hamster-wheel",
    "desk-fan",
    // "interactive-app",
    "intersection-redesign",
    "mash"
];

function parseMetaData(md) {
    // Who even knows
    const match = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    const meta = {};
    match[1].split("\n").forEach(line => {
        const [key, ...rest] = line.split(":");
        meta[key.trim()] = rest.join(":").trim();
    });

    return meta;
}

function createCardElement(meta, file) {
    const card = document.createElement('a');
    card.href = `/projects/project/?p=${file}`
    card.classList.add('project-card');

    const descContainer = document.createElement('div');
    descContainer.classList.add('desc-container');

    const img = document.createElement('div');
    img.classList.add("thumbnail");
    img.style.backgroundImage = "url('" + meta.thumbnail + "')";

    const title = document.createElement('h3');
    title.innerText = meta.title;

    const desc = document.createElement('p');
    desc.innerText = meta.description;

    descContainer.appendChild(title);
    descContainer.appendChild(desc);

    card.appendChild(img);
    card.appendChild(descContainer);

    return card;
}

async function renderProjectPreview(numCards) {

    const promises = dataFiles.slice(0, numCards).map(async (file, index) => {
        const res = await fetch(`${dataPath}/${file}.md`);
        const text = await res.text();
        const meta = parseMetaData(text);

        return {
            order: index,
            card: createCardElement(meta, file),
        };
    });

    const results = await Promise.all(promises);

    results
        .sort((a, b) => a.order - b.order)
        .forEach(({ card }) => {
            document
                .getElementById("project-cards-container")
                .appendChild(card);
        });
}

if (window.location.pathname === "/") {
    renderProjectPreview(3).then(() => {});
} else {
    renderProjectPreview(dataFiles.length).then(() => {});
}