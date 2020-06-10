# Concordia

Inject JavaScript and CSS into Discord client

## Usage

```sh
git clone https://github.com/michaelowens/Concordia
cd Concordia
# copy core.asar from Discord app
#  Win: %APPDATA%/discord/0.0.xxx/modules/discord_desktop_core/core.asar
#  Mac: ~/Library/Application\ Support/discord/0.0.xxx/modules/discord_desktop_core/core.asar
yarn install
yarn start --inject --core %APPDATA%/discord/0.0.306/modules/discord_desktop_core/core.asar
# copy core.asar into Discord app
# put your js and css into ~/Concordia (examples in plugins folder)
```

On Windows %USERPROFILE%/Concordia

### Options

- --inject
- --revert
- --core
  - default: ./core.asar
