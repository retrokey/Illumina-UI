# Nitro React v2.1

## Prerequisites

-   [Git](https://git-scm.com/)
-   [NodeJS](https://nodejs.org/) >= 18
    - If using NodeJS < 18 remove `--openssl-legacy-provider` from the package.json scripts
-   [Yarn](https://yarnpkg.com/) `npm i yarn -g`

## Installation

-   First you should open terminal and navigate to the folder where you want to clone Nitro
-   Clone Nitro
    -   `git clone https://git.krews.org/nitro/nitro-react.git`
-   Install the dependencies
    -   `yarn install`
    -   This may take some time, please be patient
-   Rename a few files
    -   Rename `public/renderer-config.json.example` to `public/renderer-config.json`
    -   Rename `public/ui-config.json.example` to `public/ui-config.json`
-   Set your links
    -   Open `public/renderer-config.json`
        -   Update `socket.url, asset.url, image.library.url, & hof.furni.url`
    -   Open `public/ui-config.json`
        -   Update `camera.url, thumbnails.url, url.prefix, habbopages.url`
    -   You can override any variable by passing it to `NitroConfig` in the index.html

## Usage

-   To use Nitro you need `.nitro` assets generated, see [nitro-converter](https://git.krews.org/nitro/nitro-converter) for instructions
-   See [Morningstar Websockets](https://git.krews.org/nitro/ms-websockets) for instructions on configuring websockets on your server

### Development

Run Nitro in development mode when you are editing the files, this way you can see the changes in your browser instantly

```
yarn start
```

### Production

To build a production version of Nitro just run the following command

```
yarn build:prod
```

-   A `dist` folder will be generated, these are the files that must be uploaded to your webserver
-   Consult your CMS documentation for compatibility with Nitro and how to add the production files

### Personalization

-   To personalize Illumina you can change `illumina.toolbar.type` inside `ui-config.json` to the 

    <br/>
    -   `default` to show the default toolbar
    <br/>
    <img src="https://i.imgur.com/DVKeHlE.png" alt="Default Toolbar" width="300"/>
    <br/>

    -   `left` will show the toolbar on the left side 
    
    <br/>
    <img src="https://i.imgur.com/J9AWuuh.png" alt="Left Toolbar" width="300"/>
    <br/>

  - Also you can personalize navigator changing `illumina.navigator.type` inside same file

  <br/>
  -   `default` to show the default navigator
  <br/>

  <img src="https://i.imgur.com/YmwMsCc.png" alt="Left Toolbar" width="300"/>

  <br/>
  -   `r63` to show the r63 styled navigator
  <br/>

  <img src="https://i.imgur.com/fo6xnQT.png" alt="Left Toolbar" width="300"/>

  <br/>
  -   `r63Large` to show the r63Large styled navigator
  <br/>
    
  <img src="https://i.imgur.com/9xXmTNF.png" alt="Left Toolbar" width="300"/>
