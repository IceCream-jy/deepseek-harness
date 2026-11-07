# Contributing

Issues and pull requests for container builds, deployment and documentation are welcome. Report Harness application issues to the [upstream project](https://github.com/deepseek-ai/deepseek-harness).

## Report an issue

Include the operating system, CPU architecture, Docker version, image tag, reproduction steps and relevant logs. Remove API keys, login tokens, private addresses and other sensitive information.

## Submit a change

- Keep changes focused and explain the reason and validation results.
- When changing versions, update the Dockerfile, workflow default tag, `.env.example` and README.
- For build changes, verify the image builds and reports the expected CLI version. For runtime changes, check Web login and data persistence.
- Do not commit credentials, data volumes, image archives or runtime logs.

Original contributions to build files, deployment files and documentation are provided under this repository's MIT license. Preserve applicable notices for third-party content.
