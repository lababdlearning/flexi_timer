# flexi_timer
Create a web application using HTML, CSS, and JavaScript with the following features:

Flow-based UI (similar to n8n):

Users can add, remove, and reorder steps in a flow.

Each step represents a timer configuration.

Steps are displayed as draggable nodes/boxes connected with arrows.

The layout should feel like a flow editor (grid background, draggable nodes).

Timer Step Configuration:

Each step should allow editing of:

Interval value (seconds or minutes)

Repeat count

Sound selection (from a predefined list of sounds).

Users should be able to update these values dynamically in the UI.

Sounds:

Preload a small set of different sounds (e.g., beep, chime, bell).

Play a sound when an interval completes.

Play a different sound when a step completes.

Sound choice should be selectable in each step.

Execution Controls:

A "Start Flow" button runs the timers sequentially as configured.

Display progress of each step and highlight the active interval.

Support pausing and stopping the flow.

Styling:

Modern UI with CSS, inspired by n8n (light gray background, rounded draggable nodes, connection lines between nodes).

Nodes should look like cards with titles, editable fields, and icons.

Smooth animations when adding/removing/reordering steps.

Implementation Notes:

Use vanilla JavaScript (no frameworks).

Use CSS Grid / Flexbox for layout.

Use SVG or Canvas for connection lines between nodes.

Keep code modular and easy to extend.