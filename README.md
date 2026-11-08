# Interview Detective

A Sherlock-themed activity builder for research methods classes.

Teachers add one or more **case files** (a study's abstract, research questions and findings as clues, plus its real interview protocol as the answer key), preview the activity, and download it as a single self-contained HTML file to share with students through a learning platform such as Brightspace, through Teams, or by email.

Students choose a case, study the clues, write the interview questions they think the researchers asked, and press **Ready to Compare** to reveal the real protocol. Arrows link their questions to similar ones, and they receive an automatic 0–100 Deduction Score (80% protocol coverage, 20% open-ended question craft). They can save a typewritten "case report" image to submit.

Live site: https://interviewdetective.collegetowns.org

## Privacy

Everything runs in the browser. Nothing a teacher or student types is sent anywhere. The builder autosaves in the teacher's own browser (IndexedDB).

## Editing the app

`index.html` is generated. Edit the files in `src/` and then run:

```
python3 build.py
```

- `src/builder-src.html`: the teacher builder
- `src/student-template-src.html`: the student activity (the builder fills in `/*__CONFIG__*/`)
- `src/student-base.css.html`: shared base styles for the student activity
- `src/scorer.js`: reference copy of the automatic scorer (also inlined in the student template)

Only include material you have the right to share; everything entered is embedded in the downloaded file.
