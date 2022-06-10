# react-native-tidypos-terminal

A react-native library to make payments in sunmi device through tidypos gateway

## Installation

```sh
npm install react-native-tidypos-terminal
```

## Usage

```js
import TidyposTerminal from "react-native-tidypos-terminal";

// ...

TidyposTerminal.startPayment(credentials, params)
    .then((data) => {
        // ...
        console.log('success', data);
    })
    .catch((err) => {
        // ...
        console.log('error', err);
    });
```

## Example
1. Place your credentials in [example/src/constants.ts]
2. `yarn example android`

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
