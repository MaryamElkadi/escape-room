# Excel Escape Room · The Missing Data

A 20-minute classroom escape room for **Primary 6 ICT**. Teams rebuild a corrupted Excel database across four missions, collect four secret digits, and unlock the final code **4729**.

Built with React + Vite. No backend, no paid APIs, no external images or fonts. After setup it runs fully offline.

**Requires:** Node.js 18+ and npm on the computer used to install/build.

---

## Quick start

```bash
cd excel-escape-room
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

For a production build:

```bash
npm run build
npm run preview
```

The built files in `dist/` can be served by any static file server. Opening `dist/index.html` directly may not work because browsers block module scripts on `file://`.

**Teacher PIN:** `2468`

---

## What you need

- A projector or large screen
- One computer per team (Excel installed)
- Four printed clue cards, sealed in envelopes A–D
- A visible timer (the game has one)
- Optional: printed scoreboard or the built-in one

---

## Classroom setup

1. Run the game on the teacher computer and project it.
2. Give each team a computer and open Excel.
3. Put the four clue envelopes in place.
4. Teams register a name and avatar.
5. Start the 20-minute timer.
6. Teams rotate the five roles after each mission.

### Station placement

| Station | Mission | Place the envelope |
| --- | --- | --- |
| **A** | Data Detectives | Front-left desk, green envelope marked A |
| **B** | Format Lab | Window sill, blue envelope marked B |
| **C** | Formula Control Room | Back bookshelf, yellow folder marked C |
| **D** | Secret Code Lab | Teacher's desk, red envelope marked D |

Print the cards from **Teacher Panel → Clues → Print Cards**. Cut along the dashed borders. The printed cards do **not** show the secret digits — the teacher verifies the work.

### Movement rules

- Walk, never run.
- One Navigator per team leaves the computer at a time.
- Whisper-level voices.
- Rotate the Computer Captain after each mission.
- Hints are free.

---

## How to play

1. **Intro** — Watch the emergency broadcast. Press **Enter the Lab**.
2. **Team setup** — Choose a team name and cyber avatar.
3. **Next Step** — The big green bar always shows what to do next. Press **Start Mission**.
4. **Mission 1** — Rebuild the student marks table and identify cell **D4**.
5. **Mission 2** — Repair bold headings, fill colour, borders and column width.
6. **Mission 3** — Predict Lina's total and average, then type `=SUM(B2:D2)` and `=AVERAGE(B2:D2)`.
7. **Mission 4** — Select `A1:D5`, build a column chart, title it **Student Marks Comparison**, and find the highest total (Sara, 285).
8. **Verification** — After each Excel task, call the teacher. Enter PIN `2468`, check the screen, then reveal the digit.
9. **Final lock** — Enter the four digits in mission order: **4 7 2 9**.
10. **Victory** — Confetti, team scores, and an optional scoreboard.

### Points

| Source | Points |
| --- | --- |
| Mission 1 | 10 |
| Mission 2 | 10 |
| Mission 3 | 20 |
| Mission 4 | 20 |
| Teamwork bonus | 10 |
| Final code | 10 |
| **Maximum** | **80** |

Teachers can award or deduct points in **Teacher Panel → Teams**.

---

## Answer key

| Mission | Check | Secret digit |
| --- | --- | --- |
| 1 | Table matches the clue; Sara's Science mark is cell **D4** | **4** |
| 2 | Bold headings + fill colour + borders + wide columns | **7** |
| 3 | `=SUM(B2:D2)` and `=AVERAGE(B2:D2)` | **2** |
| 4 | Column chart from `A1:D5`, Sara highest (285); SARA = 4 letters, 4 + 5 | **9** |

**Final password: 4 7 2 9**

Clue logic (for the teacher):

- A: The cell is **D4** → digit 4.
- B: Four formatting repairs plus 3 → 7.
- C: Four students minus 2 → 2.
- D: SARA has 4 letters, plus 5 → 9.

---

## Teacher panel

Open it with the gear button in the top bar or **Ctrl + Shift + T**.

- **Control** — pause/resume timer, add or remove minutes, reset the game, award teamwork, show the final password, toggle sound, enter projector mode.
- **Missions** — unlock a mission, or verify a mission manually and award its points.
- **Teams** — add rival teams, award +10/−5, remove teams. The live scoreboard updates immediately.
- **Clues** — print the station cards, read placement notes, and view the answer key.

The panel locks again when closed, so students cannot reopen it without the PIN.

---

## Persistence and reset

The game saves automatically in the browser under `excel-escape-room-v1`.

- Refreshing restores the team, timer, digits, points and current screen.
- Timer time is corrected for time spent away from the page.
- **Play Again** or **Teacher Panel → Reset Game** clears the save and returns to the intro.

To clear it manually, open DevTools → Application → Local Storage and delete `excel-escape-room-v1`.

---

## Customising

All game content is in `src/game/content.ts`:

- `TEACHER_PIN` — change the teacher PIN.
- `FINAL_PASSWORD` — change the final code.
- `MISSIONS` — mission text, objectives, clues, hints and station names.
- `TEACHER_CLUES` — printable card text and placement notes.
- `STATION_POSITIONS` — positions on the classroom map (percentages).
- `GAME_SECONDS` — countdown length.

If you change a secret digit, update the clue logic and the answer key too.

---

## Project structure

```
excel-escape-room/
├── src/
│   ├── App.tsx                 screen routing and modals
│   ├── styles.css              full design system, responsive and print rules
│   ├── game/
│   │   ├── content.ts          missions, clues, constants
│   │   ├── store.tsx           state, timer, scoring, localStorage
│   │   ├── audio.ts            generated Web Audio sound effects
│   │   └── types.ts            TypeScript types
│   └── components/
│       ├── Intro.tsx           cinematic emergency intro
│       ├── TeamSetup.tsx       team name and avatar
│       ├── Dashboard.tsx       mission control
│       ├── StationMap.tsx      classroom map and movement
│       ├── MissionScreen.tsx   brief, clues, hints, verification
│       ├── missions/           four interactive Excel checkpoints
│       ├── LockScreen.tsx      keypad and final code
│       ├── Scoreboard.tsx      live class ranking
│       ├── TeacherPanel.tsx    teacher controls
│       ├── Victory.tsx         final celebration
│       └── PrintClues.tsx      print-only station cards
└── package.json
```

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Page is blank | Run `npm install` and `npm run dev`, then use the printed URL. |
| Sound does not play | Browsers block audio until a click. Press any button first. |
| Fullscreen is blocked | Allow fullscreen for the site, or use the browser's F11. |
| Print shows the game screen | Use the **Print Cards** button; print styles only activate for printing. |
| Timer keeps running after refresh | It is designed to. Pause it in the teacher panel, or reset the game. |
| Team name is wrong | Reset the game and register again. |

No internet connection is required while playing.
# escape-room
