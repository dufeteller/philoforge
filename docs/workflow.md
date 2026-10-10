# GitHub workflow

Use `main` as the stable branch. Start work on `codex/<feature>` branches and open pull requests into `main`. Keep each PR focused and include its purpose and validation results. Merge only after CI passes.

After the repository exists, configure a main-branch ruleset requiring pull requests and the `scaffold` status check; disable force pushes and deletion. Choose required reviewers according to team size and repository-plan support. These remote settings are not configured by this scaffold.

Create issues from `docs/roadmap.md` as development begins. No remote issues or PRs have been created yet.

To connect this local repository after creation:

```sh
gh auth login --hostname github.com --web
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
git switch -c codex/first-feature
```

If using an existing nonempty repository, clone it and integrate this scaffold on a feature branch instead of overwriting its history.
