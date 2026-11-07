FROM node:24-trixie

ARG DSH_VERSION=0.2.2-rc.1
ARG PNPM_VERSION=10.15.1

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 tini ripgrep \
    && rm -rf /var/lib/apt/lists/* \
    && npm install --global --omit=dev --no-audit --no-fund \
       --allow-scripts=@deepseek-ai/dsh-subprocess-local,koffi,node-pty,@google/genai,protobufjs \
       "@deepseek-ai/dsh@${DSH_VERSION}" "pnpm@${PNPM_VERSION}" \
    && test "$(dsh --version)" = "${DSH_VERSION}" \
    && npm cache clean --force

ENV DSH_HOME=/home/node/.dsh \
    HOME=/workspace \
    NPM_CONFIG_CACHE=/home/node/.dsh/npm-cache \
    NARB_DISABLE_NATIVE_CACHE=1 \
    DSH_TELEMETRY_MODE=DISABLED

RUN mkdir -p /home/node/.dsh /workspace \
    && chown node:node /home/node/.dsh /workspace

COPY container-web.mjs /opt/harness/container-web.mjs

USER node
WORKDIR /workspace
ENTRYPOINT ["/usr/bin/tini", "--", "node", "--expose-internals", "/usr/local/lib/node_modules/@deepseek-ai/dsh/lib/bin.js"]
CMD ["web", "--no-open"]
