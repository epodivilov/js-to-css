function parseStringToObject(string) {
    const fixedString = string.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
    const jsonString = fixedString.replace(/'/g, '"');
    const result = eval("(" + jsonString + ")");
    return result;
}

function transformProperty(value) {
    return value.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

function transformValue(value) {
    if (typeof value === "number" || Number.isNaN(Number(value)) === false) {
        return `${parseInt(value, 10)}px`;
    }

    return value;
}

function isNeedTransformValue(propertyName) {
    return (
        [
            "animation-iteration-count",
            "border-image-outset",
            "border-image-slice",
            "border-image-width",
            "column-count",
            "columns",
            "flex",
            "flex-grow",
            "flex-shrink",
            "font-weight",
            "grid-row",
            "grid-column",
            "line-height",
            "opacity",
            "order",
            "orphans",
            "tab-size",
            "widows",
            "z-index",
        ].includes(propertyName) === false
    );
}

const form = document.querySelector("form");
const output = document.getElementById("output");
const submitButton = document.querySelector('button[type="submit"]');
const copyButton = document.querySelector('button[type="button"]');

form.addEventListener("submit", (e) => {
    const { js, css } = Object.fromEntries(new FormData(e.target));

    const data = parseStringToObject(js);

    const parts = Object.entries(data).map(([cls, properties]) => {
        const props = Object.entries(properties)
            .map(([property, value]) => {
                const propName = transformProperty(property);
                const propValue = isNeedTransformValue(propName) ? transformValue(value) : value;

                return `${"".padStart(2, " ")}${propName}: ${propValue};`;
            })
            .join("\n");

        return [`.${cls} {`, props, "}"].join("\n");
    });

    output.textContent = parts.join("");
    Prism.highlightAll();
});

copyButton.addEventListener('click', () => {
    window.navigator.clipboard.writeText(output.textContent);
})
