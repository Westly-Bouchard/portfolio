const dataPath = "/projects/data";

// Assumes that the most recent project file is first
const dataFiles = [
    "PlaceHolder1.md",
    "PlaceHolder2.md",
    "PlaceHolder3.md"
];

function parseMetaData(md) {
    const match = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    const meta = {};
    match[1].split("\n").forEach(line => {
        const [key, ...rest] = line.split(":");
        meta[key.trim()] = rest.join(":").trim();
    });

    return meta;
}

function createCardElement(meta) {
    const card = document.createElement('div');
    card.classList.add('project-card');

    const descContainer = document.createElement('div');
    descContainer.classList.add('description-container');

    const img = document.createElement('img');
    img.src = meta.thumbnail;

    const title = document.createElement('h2');
    title.innerText = meta.title;

    const desc = document.createElement('p');
    desc.innerText = meta.description;

    descContainer.appendChild(title);
    descContainer.appendChild(desc);

    card.appendChild(img);
    card.appendChild(descContainer);

    return card;
}

function renderProjectPreview() {
    dataFiles.slice(0, 3).forEach(async file => {
        const res = await fetch(dataPath + "/" + file);

        const text = await res.text();

        const meta = parseMetaData(text);

        document.getElementById("project-cards-container")
            .appendChild(createCardElement(meta));
    });
}

renderProjectPreview();