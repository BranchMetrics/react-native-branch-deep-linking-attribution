import { NativeModules, Platform } from 'react-native'

const { RNBranch } = NativeModules

export default function createBranchUniversalObject(identifier, options = {}) {
  if (typeof identifier !== 'string') throw new Error('react-native-branch: identifier must be a string')

  const branchUniversalObject = {
    canonicalIdentifier: identifier,
    contentTitle: options.title,
    contentDescription: options.contentDescription,
    contentImageUrl: options.contentImageUrl,
    contentIndexingMode: options.contentIndexingMode || 'private',
    expirationDate: options.expirationDate,
  }

  return {
    showShareSheet(shareOptions = {}, linkProperties = {}) {
      shareOptions = {
        messageHeader: '',
        messageBody: '',
        ...shareOptions,
      }

      linkProperties = {
        feature: 'share',
        channel: 'RNApp',
        ...linkProperties,
      }

      return RNBranch.showShareSheet(branchUniversalObject, shareOptions, linkProperties)
    },
    registerView() {
      return RNBranch.registerView(branchUniversalObject)
    },
    generateShortUrl() {
      return RNBranch.generateShortUrl(branchUniversalObject)
    },
    listOnSpotlight() {
      if (Platform.OS !== 'ios') return Promise.resolve()
      return RNBranch.listOnSpotlight(branchUniversalObject)
    }
  }
}

/**
 * Create an unverisal Branch object
 *
 * @params (Object) options
 *
 * @return (Promise)
 *
 * options:
 *    --------------------------------------------------------------
 *    |          KEY          |    TYPE    |      DESCRIPTION      |
 *    --------------------------------------------------------------
 *    |  canonicalIdentifier  |   String   | The object identifier |
 *    |         title         |   String   |   The object title    |
 *    |  contentDescription   |   String   |  Object description   |
 *    |    contentImageUrl    |   String   |     The image URL     |
 *    |  contentIndexingMode  |   String   |    Indexing Mode      |
 *    |                       |            |('private' or 'public')|
 *    |    contentMetadata    |   Object   |   Custom key/value    |
 *    --------------------------------------------------------------
 */
// var obj = {
//     message: res.message,
//     instanceId: res.branchUniversalObjectId
// };
//
//  /* options:
//  *    |  feature  |   String   |   The link feature    |
//  *    |   alias   |   String   |    The link alias     |
//  *    |  channel  |   String   |   The link channel    |
//  *    |   stage   |   String   |    The link stage     |
//  *    |  duration |    Int     |   The link duration   |
//     control params
//  *    |    $fallback_url   |   String   |   Fallback URL    |
//  *    |    $desktop_url    |   String   |   Desktop URL     |
//  *    |    $android_url    |   String   |   Android URL     |
//  *    |      $ios_url      |   String   |     iOS URL       |
//  *    |      $ipad_url     |   String   |    iPad URL       |
//  *    |      $fire_url     |   String   |  Kindle Fire URL  |
//  *    |  $blackberry_url   |   String   |   Blackberry URL  |
//  *    | $windows_phone_url |   String   |  Kindle Fire URL  |
//  *    -------------------------------------------------------
//  */
// obj.generateShortUrl = function (options, controlParameters) {
//     return execute('generateShortUrl', [obj.instanceId, options, controlParameters]);
// };
//
// obj.showShareSheet = function (options, controlParameters, shareText) {
//     if ( ! shareText) shareText = 'This stuff is awesome: ';
//     return execute('showShareSheet', [obj.instanceId, options, controlParameters, shareText]);
// };
//
// obj.listOnSpotlight = function () {
//     return execute('listOnSpotlight', [obj.instanceId]);
// };
