# Tally Prime Practical Manual

Mobile-friendly manual with one page per program, all using the Mayura Traders case study.

## Files (all in the repository root)

```
index.html        Home page (program cards, case study, key reference)
program-1.html    Company Creation
program-2.html    Chart of Accounts
program-3.html    Accounting Vouchers
style.css         Look and feel (light and dark, mobile first)
script.js         Menu, progress ticks, theme toggle, previous/next buttons
programs.js       List of all 10 programs (edit this when adding a program)
```

## Publish on GitHub Pages

1. Upload all files to the repository root.
2. Open **Settings -> Pages**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
3. The site opens at `https://<your-username>.github.io/<repository-name>/`.

## Add the next program (4 to 10)

1. Copy `program-3.html` to `program-4.html`.
2. Change the title, heading and step content. Keep the same markup for each step and give each tick a new key (`p4-s1`, `p4-s2` and so on).
3. In `programs.js` set `ready: true` for Program 4 and fill in its `title`, `desc` and `minutes`.
4. Commit. The menu, home card and previous/next buttons update automatically.
