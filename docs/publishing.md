# Publishing

## First release

1. Create a GitHub repository and commit all project files to its default branch, including `.github/workflows/publish.yml`.
2. Open **Actions → Publish image to GHCR → Run workflow**.
3. Use `0.2.2-rc.1-r1` for the first release. The workflow builds the image, checks the CLI version and publishes to `ghcr.io/<lowercase-owner>/<lowercase-repository>:<tag>`.
4. Find the full image reference in the run's Summary.
5. For anonymous pulls, open **Your profile → Packages → Image → Package settings** and change visibility to **Public**.

The workflow uses the automatic `GITHUB_TOKEN` with `contents: read` and `packages: write`; no personal access token is required. Organization policies may restrict publishing. A public source repository does not automatically make its image public.

## Versioning

- Use `<Harness-version>-r<N>`, for example `0.2.2-rc.1-r1`.
- Increment `r<N>` for packaging changes. When upgrading Harness, update the version prefix and start at `r1`.
- Use a new tag for each release instead of overwriting existing versions. The workflow also publishes `sha-<full-commit-SHA>`.
- Publishing is manually triggered. Committing code does not publish images or update running instances.
- Only `linux/amd64` is built. Publishing does not call model APIs.

## Troubleshooting

**Workflow missing:** Confirm the file is on the default branch at `.github/workflows/publish.yml` and Actions is enabled.

**Push denied:** Check the run logs, organization Actions/Packages policies and whether an existing package grants this repository access.

**Anonymous pull denied:** Confirm the package is public. Repository and package visibility are separate.

References: [GitHub publishing guide](https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images), [GHCR documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).
