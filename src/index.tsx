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

function test(params: any): Promise<any> {
  return TidyposTerminal.test(params);
}

function startPayment(credentials: string, params: any): Promise<any> {
  return TidyposTerminal.startPayment(credentials, params);
}

export default { startPayment, test };
