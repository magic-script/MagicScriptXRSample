import React from 'react';
import { View, Text } from 'magic-script-components';

import { authorize } from 'react-native-app-auth';
import { NativeModules } from 'react-native';

const { XrApp, XrClientBridge } = NativeModules;

const oAuthConfig = {
  cacheKey: 'auth/prod',
  issuer: 'https://auth.magicleap.com',
  clientId: 'com.magicleap.mobile.magicscript',
  redirectUrl: 'magicscript://code-callback',
  scopes: [
    'openid',
    'profile',
    'email'
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://oauth.magicleap.com/auth',
    tokenEndpoint: 'https://oauth.magicleap.com/token'
  }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const getUUID = (id, pose) => `${id}#[${pose}]`;

class MyApp extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      scenes: {},
      anchorCount: 0
    };
  }

  componentDidMount () {
    setTimeout(async () => {
      console.log('MyXrDemoApp: sharing ARSession');
      await XrApp.shareSession();

      await sleep(1000);

      const oauth = await this.authorizeToXrServer(oAuthConfig);

      await sleep(1000);

      const status = await this.connectToXrServer(oauth);

      this._updateInterval = setInterval(() => this.updateAnchors(), 1000);

    }, 1000);
  }

  componentWillUnmount () {
    if (Object.keys(this.state.scenes).length > 0) {
      XrClientBridge.removeAllAnchors();
    }
  }

  async authorizeToXrServer (config) {
    console.log('MyXrDemoApp: authorizing');
    const result = await authorize(config);
    console.log('MyXrDemoApp: oAuthData', result);
    return result;
  }

  async connectToXrServer (config) {
    console.log('MyXrDemoApp: XrClientBridge.connecting');
    const result = await XrClientBridge.connect(config.accessToken);
    console.log('MyXrDemoApp: XrClientBridge.connect result', result);
    return result;
  }

  async updateAnchors () {
    const status = await XrClientBridge.getLocalizationStatus();
    console.log('MyXrDemoApp: localization status', status);

    XrApp.setStatusMessage(status);

    if (status === 'localized' && this.state.anchorCount === 0) {
      const pcfList = await XrClientBridge.getAllPCFs();
      console.log(`MyXrDemoApp: received ${pcfList.length} PCFs`);

      if (pcfList.length > 0) {
        clearInterval(this._updateInterval);
      }

      var scenes = {};

      pcfList.forEach(pcfData => this.updateScenes(scenes, pcfData));

      this.setState({ scenes: scenes, anchorCount: pcfList.length });

      Object.values(scenes).forEach(scene => {
        // console.log(`PCF Id: ${scene.pcfId}, Pose:`, scene.pcfPose);
        XrClientBridge.createAnchor(scene.uuid, scene.pcfPose);
      });
    }
  }

  updateScenes (scenes, pcfData) {
    const uuid = getUUID(pcfData.anchorId, pcfData.pose);

    if (scenes[pcfData.anchorId] === undefined) {
      scenes[pcfData.anchorId] = {
        uuid: uuid,
        pcfId: pcfData.anchorId,
        pcfPose: pcfData.pose
      };
    }
  }

  render () {
    const scenes = Object.values(this.state.scenes);
    return (
      <View name='main-view'>
        { scenes.length === 0
          ? (<Text text='Initializing ...' />)
          : scenes.map( scene => <Text key={scene.uuid} anchorUuid={scene.uuid} textSize={0.1} textColor={[1, 0, 0, 1]} text={scene.pcfId} />)
        }
      </View>
    );
  }
}

export default MyApp;
