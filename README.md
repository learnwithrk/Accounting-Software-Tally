# Tally Prime Practical Manual

Mobile-friendly manual with one page per program, all using the Mayura Traders case study.

## Folder structure

```
index.html            Home page (program cards, case study, key reference)
program-1.html        Company Creation
program-2.html        Chart of Accounts
program-3.html        Accounting Vouchers
assets/style.css      Look and feel (light and dark, mobile first)
assets/script.js      Menu, progress ticks, theme toggle, previous/next buttons
assets/programs.js    List of all 10 programs (edit this when adding a program)
.nojekyll             Tells GitHub Pages to serve the files as they are
```

## Publish on GitHub Pages

1. Create a repository (for example `tally-manual`).
2. Upload everything in this folder, keeping the `assets` folder and the `.nojekyll` file.
3. Open **Settings -> Pages**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. Your site opens at `https://<your-username>.github.io/tally-manual/`.

## Add the next program (4 to 10)

1. Copy `program-3.html` to `program-4.html`.
2. Change the page title, heading and the content of the steps. Keep the same markup for each step:
   `<section class="step" id="p4-s1"> ... </section>` (change the id and the `data-key` to `p4-s1`, `p4-s2` and so on).
3. In `assets/programs.js` set `ready: true` for Program 4 and fill in its `title`, `desc` and `minutes`.
4. Commit. The menu, home page card and previous/next buttons update automatically.
