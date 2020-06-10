# Concordia

Inject JavaScript and CSS into Discord client

## Usage

```sh
git clone https://github.com/michaelowens/Concordia
cd Concordia
#  Win: %APPDATA%/discord/0.0.xxx/modules/discord_desktop_core/core.asar
#  Mac: ~/Library/Application\ Support/discord/0.0.xxx/modules/discord_desktop_core/core.asar
yarn install
yarn start --inject --core %APPDATA%/discord/0.0.306/modules/discord_desktop_core/core.asar
# put your js and css into ~/Concordia (examples in plugins folder)
```

On Windows %USERPROFILE%/Concordia

### Options

- --inject
- --revert
- --core
  - default: ./core.asar
