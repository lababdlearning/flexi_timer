
# flexi_timer

A modern, flow-based timer web application inspired by n8n, built with vanilla JavaScript, HTML, and CSS. Easily create, save, and reuse custom timer flows with sound notifications for each step.

---

## Features

- **Flow-based UI**: Add, remove, and reorder timer steps as draggable nodes connected by arrows.
- **Step Configuration**: Each step allows editing of:
	- Interval value (seconds or minutes)
	- Repeat count
	- Sound selection for interval and step completion
- **Sound Support**: Choose from preloaded sounds (beep, chime, bell) for each step.
- **Execution Controls**: Start, pause, and stop the flow. See progress and active step highlighted.
- **Save/Load Flows**: Export your flow as a JSON file. Import from file or load from reusable templates.
- **Templates**: Store reusable flows in the `templates/` directory. The app loads available templates from `templates/index.json`.
- **Modern UI**: Responsive, card-style nodes, smooth animations, SVG connection lines.
- **Dockerized**: Easily run locally or deploy anywhere with Docker and docker-compose.

---

## Quick Start

### 1. Local Development

1. **Clone the repo**
2. **Open `index.html` in your browser**

No build step or server required for local use.

### 2. Docker Deployment

1. Build and run with Docker Compose:

	 ```bash
	 docker-compose up --build
	 ```

2. Open [http://localhost:8082](http://localhost:8082) in your browser.

---

## File Structure

- `index.html` — Main UI
- `style.css` — Modern, responsive styles
- `script.js` — All timer/flow logic
- `sounds/` — Preloaded sound files (`beep.mp3`, `chime.mp3`, `bell.mp3`)
- `templates/` — Place exported flow JSONs here for reuse
	- `index.json` — List of available templates (e.g. `["3step.json"]`)
- `Dockerfile`, `docker-compose.yml`, `nginx.conf` — For containerized deployment

---

## How to Use

1. **Add Steps**: Click "Add Step" to create timer steps. Drag to reorder.
2. **Configure Steps**: Set interval, repeat, and select sounds for each step.
3. **Start Flow**: Click "Start Flow" to run. Progress and active step are shown.
4. **Pause/Stop**: Use pause/stop controls as needed.
5. **Save Flow**: Click "Save Flow" to export your configuration as a JSON file.
6. **Import Flow**: Click "Import Flow" to load a flow from a JSON file.
7. **Load Template**: Use the dropdown to load a reusable flow from the `templates/` directory.

---

## Adding Templates

1. Export a flow using "Save Flow".
2. Place the exported JSON file in the `templates/` directory.
3. Add the filename to `templates/index.json` (e.g. `["3step.json", "myflow.json"]`).
4. Reload the app. The template will appear in the dropdown.

---

## Customization

- Add more sounds to the `sounds/` directory and update the `SOUNDS` array in `script.js`.
- Tweak styles in `style.css` for a different look.
- Extend logic in `script.js` for advanced flows.

---

## License

MIT