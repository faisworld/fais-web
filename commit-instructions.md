# Committing Changes to GitHub

## 1. Check the Status

First, check the status of your repository to see what files have been modified:

```bash
git status
```

## 2. Review Changes

Make sure that no sensitive data is being committed. The `.env` file should be ignored due to the entry in `.gitignore`.

## 3. Stage Your Changes

Add all changes to the staging area:

```bash
git add .
```

## 4. Commit Your Changes

Create a commit with a descriptive message:

```bash
git commit -m "Add reCAPTCHA integration, implement admin panel, update component structure"
```

## 5. Push to GitHub

Push the commit to the main branch on GitHub:

```bash
git push origin main
```

## 6. Verify the Push

Visit your GitHub repository at <https://github.com/faisworld/fais-web> to confirm that your changes have been successfully pushed.

## Troubleshooting

If you encounter any issues:

- **Authentication errors**: Make sure you're authenticated with GitHub
- **Rejection errors**: Pull the latest changes first with `git pull origin main`
- **File ignored by .gitignore**: Use `-f` flag only if you're absolutely sure: `git add -f filename`

```
