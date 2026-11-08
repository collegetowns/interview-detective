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

## Starter cases

New activities start with four starter cases taken from real open-access studies; teachers can delete them, add them back, or add their own cases. They are reproduced under each article's Creative Commons license, and the citation, link and license are shown to students with each case.

| Case | Source | License |
|---|---|---|
| Special Education | Wilshire, J. M., II, Voelkel, R. H., Jr., Pazey, B., & Van Tassell, F. (2025). Inclusive professional learning communities and special education collaboration: A qualitative case study in Texas. *Education Sciences, 15*(10), 1279. https://doi.org/10.3390/educsci15101279 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Global Citizenship | Andrews, K., & Aydin, H. (2020). Pre-service teachers' perceptions of global citizenship education in the social studies curriculum. *Journal of Social Studies Education Research, 11*(4), 84–113. https://files.eric.ed.gov/fulltext/EJ1281589.pdf | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Student-Athlete Transition | Woltring, M. T., Hauff, C., Forester, B., & Holden, S. L. (2021). "I didn't know how all this works": A case study examining the transition experiences of student-athletes from high school to a mid-major DI program. *Journal of Athlete Development and Experience, 3*(2), Article 4. https://doi.org/10.25035/jade.03.02.04 | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) |
| Higher Ed Veteran Students | Kappell, J., Boersma, J., DeVita, J., & Parker, M. (2017). Student veterans' participation in high-impact practices: Veterans' experiences at three institutions of higher education in southeastern North Carolina. *Journal of Veterans Studies, 2*(1), 29–49. https://doi.org/10.21061/jvs.v2i1.27 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

Changes from the originals: abstracts, research questions and interview protocols are reproduced as published; short context notes and findings summaries were condensed from each article; nested follow-up prompts in the student-athlete guide were merged into their parent sub-question. The Student-Athlete Transition case is licensed for non-commercial use only.

Only include material you have the right to share; everything entered is embedded in the downloaded file.
