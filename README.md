# DeepSeek Harness Docker

Unofficial container packaging built from the official Node.js image and the official `@deepseek-ai/dsh` npm package. Not affiliated with or endorsed by DeepSeek.

- Harness `0.2.2-rc.1`, Node.js `24-trixie`.
- Web UI and agent runtime; no browser desktop included.
- Non-root runtime with persistent settings, sessions and workspace files.
- Published platform: `linux/amd64`. Requires Linux Docker, including Docker-based TrueNAS SCALE installations.

## Quick start

Install Docker Engine and the Compose plugin. An SSH account is required for the tunnel; host port `3080` must be available.

```sh
cp .env.example .env
```

Set `IMAGE` in `.env` to your published GHCR image. Optionally set HTTP proxy variables, then start:

```sh
docker compose pull
docker compose up -d
docker compose logs --tail=30 harness
```

Keep this tunnel running on your computer, replacing the user and server:

```sh
ssh -N -L 3080:127.0.0.1:3080 USER@SERVER
```

Open the complete localhost URL containing `?token=…` from the logs. Configure your provider and API key in **Settings → Models**, then select `/workspace`.

## Configuration and data

| Setting | Purpose |
| --- | --- |
| `IMAGE` | Image reference and version |
| `HTTP_PROXY` / `HTTPS_PROXY` | Runtime proxy; empty means direct |
| `NO_PROXY` | Hosts or domains that bypass the proxy |
| `harness-home` volume | Settings, credentials and sessions |
| `harness-workspace` volume | Working files |

Runtime proxy variables do not configure Docker image pulls. Use host names or domains in `NO_PROXY`, not CIDR ranges.

Host networking allows the loopback Web listener to be accessed through SSH and shares the host's network namespace. Do not expose the service publicly or mount the host root or Docker socket.

## Update and build

Back up both volumes before upgrading. Update `IMAGE` in `.env`, then run `docker compose pull` and `docker compose up -d`. `docker compose down` preserves volumes; `down -v` deletes them.

```sh
docker build --pull -t deepseek-harness-local:0.2.2-rc.1 .
docker run --rm deepseek-harness-local:0.2.2-rc.1 --version
```

To use the local build, set `IMAGE` accordingly and run `docker compose up -d` without pulling.

[Publishing](docs/publishing.md) · [Contributing](CONTRIBUTING.md)

## Validation

Build, Web authentication, volume persistence across restart and native proxy connectivity were checked on Debian x86_64. Real model calls, agent command execution and TrueNAS deployment have not been verified. The base image tag and transitive dependencies are not fully locked; rebuilds are not byte-for-byte reproducible.

## License

Build and deployment files are licensed under [MIT](LICENSE). [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) and other bundled software retain their respective licenses and notices.
