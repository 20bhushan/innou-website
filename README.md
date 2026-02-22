INNOU Website – Maintenance Guide
📌 Project Overview

This website is built using:

Next.js (App Router)

Three.js (3D background engine)

GSAP (animation timing)

The 3D animation system is modular and must NOT be modified unless you fully understand how it works.

🚀 How To Run The Project
Install dependencies
npm install
Start development server
npm run dev

Open:
http://localhost:3000

🔧 How To Update For Next Year
1️⃣ Update Event Details

Edit this file:

src/config/eventConfig.js

You can safely change:

Event name

Year

Countdown date

Contact details

Sponsor list

Do NOT edit animation files for this.

2️⃣ Update Text or Sections

Edit files inside:

src/components/sections/

You can:

Change text

Replace images

Add or remove sections

3️⃣ Update Colors

Edit:

src/config/themeConfig.js

Change:

Primary color

Secondary color

Background color

⚠ DO NOT MODIFY
src/components/three/

This folder contains:

Particle morph engine

Floating objects system

Camera animation

Rendering system

Changing these files may break the entire website.

Only modify if you fully understand Three.js.

🛠 If Something Breaks

Check browser console for errors.

Ensure images exist in /public.

Revert changes inside three/ folder if animation breaks.

🏗 Project Structure
src/
components/
sections/ ← Editable
ui/ ← Editable
three/ ← Do Not Modify
config/ ← Safe to Edit
👨‍💻 Maintained By

INNOU Technical Team
Year: 2026
