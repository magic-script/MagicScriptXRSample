import { AppRegistry, NativeModules } from 'react-native';
import { XrClientProvider } from 'magic-script-components';
import { ReactNativeMagicScript } from 'magic-script-components-react-native';
import ReactNativeApp from '../react-native/ReactNativeApp';

XrClientProvider.setXrClient(NativeModules.XrClientBridge);

const MagicScript = {
    registerApp: (name, appComponent, debug = false) => {
        AppRegistry.registerComponent(name, () => ReactNativeApp);
        ReactNativeMagicScript.render(appComponent, { name: 'root' }, null, debug);
    }
};

export { MagicScript };
