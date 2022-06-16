import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-tidypos-terminal' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const TidyposTerminal = NativeModules.TidyposTerminal
  ? NativeModules.TidyposTerminal
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

function convertToString(params: any): any {
  for (let key in params) {
    if (params[key] !== null && params[key] !== undefined) {
      params[key] = String(params[key]);
    }
  }
  return params;
}

function test(params: any): Promise<any> {
  return TidyposTerminal.test(convertToString(params));
}

function startPayment(credentials: string, params: any): Promise<any> {
  return TidyposTerminal.startPayment(credentials, convertToString(params));
}

export default { startPayment, test };
