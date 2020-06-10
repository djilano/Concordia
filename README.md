# Concordia

Inject JavaScript and CSS into Discord client

## Usage

1. Clone the repository <br>
`git clone https://github.com/michaelowens/Concordia`

2. Open Concordia folder <br>
`cd Concordia`

3. Run NPM or Yarn install <br>
`npm i` or `yarn install`

4. Create a custom Concordia plugin folder <br>
`mkdir ~/Concordia` or when using windows `%USERPROFILE%/Concordia`

5. Copy over **core.asar** (re-run per discord version) <br>
Windows<br>
`npm start -- --inject --core %APPDATA%/discord/0.0.306/modules/discord_desktop_core/core.asar` <br>
`yarn start --inject --core %APPDATA%/discord/0.0.306/modules/discord_desktop_core/core.asar`

Mac<br>
`npm start -- --inject --core ~/Library/Application\ Support/discord/0.0.306/modules/discord_desktop_core/core.asar` <br>
`yarn start --inject --core ~/Library/Application\ Support/discord/0.0.306/modules/discord_desktop_core/core.asar`


### Options

- --inject
- --revert
- --core
  - default: ./core.asar
