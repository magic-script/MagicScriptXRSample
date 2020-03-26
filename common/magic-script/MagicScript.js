import { AppRegistry, NativeModules } from 'react-native';
import { XrClientProvider } from 'magic-script-components';
import { ReactNativeMagicScript } from 'magic-script-components-react-native';
import ReactNativeApp from '../react-native/ReactNativeApp';
import { authorize } from 'react-native-app-auth';

XrClientProvider.setXrClient(NativeModules.XrClientBridge);

// Tack on authorize function for react-native only (not needed for lumin)
XrClientProvider.authorize = authorize;

const MagicScript = {
    registerApp: (name, appComponent, debug = false) => {
        AppRegistry.registerComponent(name, () => ReactNativeApp);
        ReactNativeMagicScript.render(appComponent, { name: 'root' }, null, debug);
    }
};

export { MagicScript };
