# Container isolation

Use the supplied Compose configuration with image release `0.2.2-rc.1-r2` or newer. Release `r1` does not contain the container Web relay required by this configuration.

## Enforced defaults

- UID/GID `1000:1000`, all Linux capabilities dropped, and no-new-privileges.
- Read-only root filesystem. Only the two named volumes and a 256 MiB temporary filesystem are writable.
- `/tmp` uses `noexec,nosuid,nodev`. Some tools may fail when they require executable temporary files.
- Dedicated Docker bridge network. No host networking, shared host PID namespace, device mappings, host paths or Docker socket.
- The Web relay binds one container IPv4 address and forwards raw TCP to Harness's loopback listener. It preserves authentication, HTTP headers and WebSocket traffic.
- The host publishes the Web port on `127.0.0.1` only. Access through an SSH tunnel; retain token authentication.
- Two CPUs, 2 GiB RAM, no additional swap allowance, 256 processes and rotated container logs.
- Keep Docker's default seccomp profile and the host's available security profiles. Do not add privileged mode or unconfined profiles to fix tool errors.

## Remaining boundaries

Containers share the host kernel. This setup reduces host access; it does not guarantee protection against container escapes, kernel vulnerabilities or resource contention.

Bridge networking is not an outbound allowlist. The container can still connect to reachable host, LAN and Internet services. Proxy environment variables are routing preferences, not firewall rules. Restrict destinations with host/network firewall rules appropriate to your Docker and TrueNAS version. Restrict the proxy itself as well so it cannot bypass those rules.

Named volumes have no capacity limit in this configuration. Apply storage quotas to the app storage location or use dedicated quota-limited datasets with correct UID/GID permissions. CPU and memory limits do not prevent disk or I/O exhaustion.

Harness can change or delete files in its workspace and read credentials exposed to it. Do not provide NAS administrator credentials, personal SSH keys or shared folders. Use a dedicated model key and retain Harness's approval and execution restrictions. Back up persistent data before changes.

## Verification

The hardened configuration was checked on Debian x86_64: Docker's effective network, user, mounts and resource settings; authenticated Web login; writable volume persistence after restart; and native Harness proxy connectivity. Model calls, agent command execution, outbound firewall rules and TrueNAS deployment have not been verified.

References: [Docker security](https://docs.docker.com/engine/security/), [resource constraints](https://docs.docker.com/engine/containers/resource_constraints/), [Harness safety notice](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md).
