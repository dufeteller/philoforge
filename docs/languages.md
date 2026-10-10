# Languages / Langues

English is the primary project and website language. French is a supported display language, maintained in the same repository.

The website translation catalogue is `website/dist/assets/locales.js`. Add a French translation for each new visible English string, including axiom statements, deduction steps, messages, and accessibility labels. Keep logical IDs and dependencies language-independent. Run `node website/tests/i18n.cjs` and `node website/tests/consequences.cjs` before publishing.

## Contribuer en français

Les contributions peuvent être rédigées en français. Pour le contenu du site, conservez la version anglaise de référence et ajoutez la traduction dans le catalogue. Les identifiants des axiomes et des règles sont communs aux deux langues : traduire un énoncé ne crée pas un nouvel axiome.

Le sélecteur EN / FR mémorise le choix du visiteur. Les textes personnels saisis ne sont pas traduits automatiquement. Les exports JSON restent en anglais pour conserver une représentation commune, avec la langue d’affichage enregistrée.
