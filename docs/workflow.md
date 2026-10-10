# GitHub workflow

Use `main` as the stable branch. Start work on `codex/<feature>` branches and open pull requests into `main`. Keep each PR focused and include its purpose and validation results. Merge only after CI passes.

The public repository is https://github.com/dufeteller/philoforge. The initial scaffold is published on `main`.

Configure a main-branch ruleset requiring pull requests and the `scaffold` status check; disable force pushes and deletion. Choose required reviewers according to team size and repository-plan support. These remote settings are not configured by this scaffold.

Create issues from `docs/roadmap.md` as development begins. Issues are not created automatically; use the provided feature and bug templates.

For another checkout, clone the project:

```sh
git clone https://github.com/dufeteller/philoforge.git
cd philoforge
git switch -c codex/first-feature
```

If using an existing nonempty repository, clone it and integrate this scaffold on a feature branch instead of overwriting its history.
