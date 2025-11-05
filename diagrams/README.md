Diagrams for TicketForge
========================

Files in this folder:

- `flow.mmd` — Mermaid sequence diagram showing signup, auth, and ticket publish flows.
- `system.mmd` — Mermaid component/architecture diagram showing services (auth, DB, NATS, subscribers) and infra.

How to view
-----------

- GitHub: Recent GitHub renders Mermaid diagrams embedded in Markdown files. To preview the `.mmd` files, paste their contents into a Markdown file fenced with ```mermaid
  (or into mermaid.live).
- mermaid.live: open https://mermaid.live and paste the contents of either `.mmd` file to preview and export as PNG/SVG.
- mermaid-cli (mmdc): install via npm: `npm i -g @mermaid-js/mermaid-cli` and run:

```powershell
mmdc -i diagrams/flow.mmd -o diagrams/flow.png
mmdc -i diagrams/system.mmd -o diagrams/system.png
```

- PlantUML: if you prefer PlantUML, you can convert the concepts manually or use online tools.

Notes and suggestions
---------------------
- These diagrams are intentionally minimal and focus on the control/data flow between components. Expand them with more services (billing, orders, notifications) as needed.
- For architecture docs, add sequence diagrams for edge-cases (e.g., token refresh, failed DB writes, retry/backoff on NATS).
