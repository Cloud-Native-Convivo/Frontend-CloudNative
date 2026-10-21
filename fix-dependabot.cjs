const fs = require('fs');

const path = '.github/dependabot.yml';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
`    labels: ["dependencies"]
    groups:
      react:`,
`    labels: ["dependencies"]
    ignore:
      - dependency-name: "typescript"
        versions: [">= 6.0.0"]
    groups:
      react:`
);

fs.writeFileSync(path, content);
