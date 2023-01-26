cli app for Assessment Test - Backend Developer 
Contributor : Kresna Faza Rizkyawan

# node-cli
cli app to convert log dile to .txt and .json file

## Setup
install dependencies
```
npm i -g
```
use flag -g to register app globally

## Usage Example
```
fazacli /var/log/syslog
```

## Help
use this for complete usage instructions
```
fazacli -h
```
or
```
fazacli --help
```
### Limitations
+ Log file converted to json for one key for one value, cannot convert to json if one key for multiple value
+ JSON file should be formatted with another tools to make it readable

## Version
1.0.0


