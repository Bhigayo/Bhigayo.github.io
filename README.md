# Abdulmalik OS

My portfolio, built as a desktop operating system. On a laptop you get windows you can drag, resize, minimise and maximise, a dock, a menu bar, desktop icons and a working terminal. On a phone it becomes a home screen of apps.

- **Projects:** a Finder-style window. Double-click a project to see what it does, its highlights and its tech stack.
- **Run it here:** the live app opens inside a window. Apps that need a camera or take real payments open in a new tab instead.
- **Case studies:** the Eatsbythia and Saldo case studies open as documents, and the whole previous site is in **Classic site**.
- **Terminal:** try `help`, `projects`, `open saldo`, `skills`, `neofetch`, `contact` or `sudo`. Use ↑ for history and Tab to complete commands.
- **Settings:** three wallpapers. The night sky drifts slightly as you move the pointer.

## How it's built

- `src/wm.ts` is the window manager: a pure reducer for open, focus, move, resize, minimise and maximise. It keeps windows on screen so they can always be grabbed.
- `src/terminal.ts` holds the terminal commands. Both files are covered by tests in `src/os.test.ts`.
- `src/projects.ts` is all the content. **Edit links here.**

## Before publishing

- Replace `YOUR-LINKEDIN` in `src/projects.ts`.
- Each project's `url` assumes it's deployed at `bhigayo.github.io/<name>/`. Deploy Ajo, Hands Free and Draw Together and they'll work. Until then their **Open live** links will 404.
- Make sure each project's repo is public, or remove its `code` link.

## Put it online

This is the main site, so it goes in the special repo **`Bhigayo.github.io`**. That repo already holds the classic site; this replaces it, and the classic pages are kept inside under `public/classic/`.

In PowerShell, run one line at a time inside this folder:

```
git init
git add -A
git commit -m "Abdulmalik OS"
git branch -M main
git remote add origin https://github.com/Bhigayo/Bhigayo.github.io.git
git push -u origin main --force
```

`--force` replaces what's in that repo, so only use it if you're happy for the classic site to be replaced (it's kept inside under Classic site). Then go to **Settings → Pages → Source: GitHub Actions**. It will be live at https://bhigayo.github.io/.

## Run it

```
npm install
npm run dev
npm test
```
