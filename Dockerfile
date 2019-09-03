FROM node:12

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
    && apt-get -y install xvfb gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
      libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
      libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
      libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
      libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /src/*.deb

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 /usr/local/bin/dumb-init 
RUN chmod +x /usr/local/bin/dumb-init

## Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
# ENV HCEP_USE_CHROMIUM true
## else use chrome enable below settings
ENV HCEP_USE_CHROMIUM false
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROME_BINARY /usr/bin/google-chrome-stable

# Node Environment
ENV NODE_ENV production

# Copy the app and install dependencies
COPY package.json /hcep/
COPY yarn.lock /hcep/
WORKDIR /hcep/
RUN yarn install \
    && chmod -R o+rx /hcep
COPY . /hcep/
RUN chmod -R o+rx /hcep

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /hcep

# Run everything after as non-privileged user.
USER pptruser

# Install fonts
COPY fonts /usr/share/fonts

# # Test
# COPY test /hcep/test
# RUN npm test

# If you want to extend pdf options, rename app/my-pdf-option-presets.js.sample to app/my-pdf-option-presets.js and activate this
# ENV HCEP_MY_PDF_OPTION_PRESETS_FILE_PATH="./my-pdf-option-presets"

EXPOSE 8000
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
