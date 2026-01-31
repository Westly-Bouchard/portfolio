const dataPath = "/assets/markdown";

// Assumes that the most recent project file is first
const dataFiles = [
    "PlaceHolder1.txt",
    "PlaceHolder2.txt",
    "PlaceHolder3.txt"
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

function createCardElement(meta) {
    const card = document.createElement('div');
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
    // card.appendChild(title);
    // card.appendChild(desc);

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