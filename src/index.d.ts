export const VERSION: string;

type AnyDataType =
  | string
  | boolean
  | number
  | null
  | undefined
  | AnyDataArray
  | AnyDataObject;
interface AnyDataArray extends Array<AnyDataType> {}
interface AnyDataObject extends Record<string, AnyDataType> {}

export interface BranchParams {
  '~channel'?: string;
  '~feature'?: string;
  '~tags'?: string[];
  '~campaign'?: string;
  '~stage'?: string;
  '~creation_source'?: number;
  '~referring_link'?: string;
  '~id'?: string;
  '+match_guaranteed': boolean;
  '+referrer'?: string;
  '+phone_number'?: string;
  '+is_first_session': boolean;
  '+clicked_branch_link': boolean;
  '+click_timestamp'?: number;
  '+url'?: string;
  '+rn_cached_initial_event'?: boolean;
  [data: string]: AnyDataType;
}

export type BranchEventParams = Pick<
  BranchEvent,
  | 'transactionID'
  | 'currency'
  | 'revenue'
  | 'shipping'
  | 'tax'
  | 'coupon'
  | 'affiliation'
  | 'description'
  | 'searchQuery'
  | 'alias'
  | 'customData'
>;

export type ATTAuthorizationStatus =
  | 'authorized'
  | 'denied'
  | 'undetermined'
  | 'restricted';

export type BranchAttributionLevel = 'FULL' | 'REDUCED' | 'MINIMAL' | 'NONE';

export class BranchEvent {
  logEvent: () => Promise<null>;
  constructor(
    name: string,
    contentItems?: BranchUniversalObject | BranchUniversalObject[],
    params?: BranchEventParams
  );
  name: string;
  contentItems: BranchUniversalObject[];

  transactionID?: string;
  currency?: string;
  revenue?: string | number;
  shipping?: string | number;
  tax?: string | number;
  coupon?: string;
  affiliation?: string;
  description?: string;
  searchQuery?: string;
  alias?: string;
  customData?: Record<string, string>;

  /**
   * Standard Add to Cart event
   */
  static AddToCart: string;

  /**
   * Standard Add to Wishlist event
   */
  static AddToWishlist: string;

  /**
   * Standard View Cart event
   */
  static ViewCart: string;

  /**
   * Standard Initiate Purchase event
   */
  static InitiatePurchase: string;

  /**
   * Standard Add Payment Info event
   */
  static AddPaymentInfo: string;

  /**
   * Standard Purchase event
   */
  static Purchase: string;

  /**
   * Standard View Ad event
   */
  static ViewAd: string;

  /**
   * Standard Click Ad event
   */
  static ClickAd: string;

  // Content events

  /**
   * Standard Search event
   */
  static Search: string;

  /**
   * Standard View Item event for a single Branch Universal Object
   */
  static ViewItem: string;

  /**
   * Standard View Items event for multiple Branch Universal Objects
   */
  static ViewItems: string;

  /**
   * Standard Rate event
   */
  static Rate: string;

  /**
   * Standard Share event
   */
  static Share: string;

  // User Lifecycle Events

  /**
   * Standard Complete Registration event
   */
  static CompleteRegistration: string;

  /**
   * Standard Complete Tutorial event
   */
  static CompleteTutorial: string;

  /**
   * Standard Achieve Level event
   */
  static AchieveLevel: string;

  /**
   * Standard Unlock Achievement event
   */
  static UnlockAchievement: string;

  /**
   * Standard Invite event
   */
  static Invite: string;

  /**
   * Standard Login event
   */
  static Login: string;

  /**
   * Standard Reserve event
   */
  static Reserve: string;

  /**
   * Standard Subscribe event
   */
  static Subscribe: string;

  /**
   * Standard Start Trial event
   */
  static StartTrial: string;
}

interface BranchSubscriptionEventBase {
  params: BranchParams | undefined;
  error: string | null | undefined;
  uri: string | undefined;
}
export interface BranchSubscriptionEventError extends BranchSubscriptionEventBase {
  error: string;
}
export interface BranchSubscriptionEventSuccess extends BranchSubscriptionEventBase {
  error: null | undefined;
  params: BranchParams;
}
export type BranchSubscriptionEvent =
  | BranchSubscriptionEventError
  | BranchSubscriptionEventSuccess;
export interface BranchOpenStartEvent {
  uri: string;
  cachedInitialEvent?: boolean;
}
type BranchSubscribeCallback = (event: BranchSubscriptionEvent) => void;
interface BranchSubscribeOptions {
  onOpenComplete: BranchSubscribeCallback;
  onOpenStart?: (event: BranchOpenStartEvent) => void;
}
type BranchUnsubscribe = () => void;
type BranchSubscribe = (
  options: BranchSubscribeCallback | BranchSubscribeOptions
) => BranchUnsubscribe;

interface BranchUniversalObjectOptions {
  locallyIndex?: boolean;
  publiclyIndex?: boolean;
  canonicalUrl?: string;
  title?: string;
  contentDescription?: string;
  contentImageUrl?: string;
  contentMetadata?: {
    price?: number | string;
    contentSchema?: any; // TODO
    quantity?: number;
    sku?: string;
    productName?: string;
    productBrand?: string;
    productCategory?: any; // TODO
    productVariant?: string;
    condition?: any; // TODO
    currency?: string;
    ratingAverage?: number;
    ratingCount?: number;
    ratingMax?: number;
    addressStreet?: string;
    addressCity?: string;
    addressRegion?: string;
    addressCountry?: string;
    addressPostalCode?: string;
    latitude?: number;
    longitude?: number;
    imageCaptions?: string[];
    customMetadata?: Record<string, string>;
  };
}

export interface BranchShareSheetOptions {
  messageHeader?: string;
  messageBody?: string;
  emailSubject?: string;
  title?: string;
  text?: string;
}

export interface BranchLinkProperties {
  alias?: string;
  campaign?: string;
  feature?: string;
  channel?: string;
  stage?: string;
  tags?: string[];
}

export interface BranchLinkControlParams {
  $fallback_url?: string;
  $desktop_url?: string;
  $ios_url?: string;
  $ipad_url?: string;
  $android_url?: string;
  $samsung_url?: string;
}

interface BranchShareSuccess {
  completed: true;
  error: null;
  channel: string;
}

interface BranchShareFailure {
  completed: false;
  error: null | string;
  channel: null;
}

interface BranchUniversalObject {
  ident: string;
  showShareSheet: (
    shareOptions?: BranchShareSheetOptions,
    linkProperties?: BranchLinkProperties,
    controlParams?: BranchLinkControlParams
  ) => Promise<BranchShareSuccess | BranchShareFailure>;
  generateShortUrl: (
    linkProperties?: BranchLinkProperties,
    controlParams?: BranchLinkControlParams
  ) => Promise<{ url: string }>;
  logEvent: (eventName: string, params?: BranchEventParams) => Promise<null>;
  release: () => void;
}

interface BranchQRCodeSettings {
  codeColor?: string;
  backgroundColor?: string;
  centerLogo?: string;
  width?: number;
  margin?: number;
  imageFormat?: string;
}

interface Branch {
  subscribe: BranchSubscribe;
  initSessionTtl?: number;
  skipCachedEvents: () => void;
  disableTracking: (disable: boolean) => void;
  isTrackingDisabled: () => Promise<boolean>;
  getLatestReferringParams: (synchronous?: boolean) => Promise<BranchParams>;
  getFirstReferringParams: () => Promise<BranchParams>;
  lastAttributedTouchData: (
    attributionWindow?: number
  ) => Promise<BranchParams>;
  setIdentity: (identity: string) => void;
  setIdentityAsync: (identity: string) => Promise<BranchParams>;
  setRequestMetadata: (key: string, value: string) => void;
  addFacebookPartnerParameter: (name: string, value: string) => void;
  addSnapPartnerParameter: (name: string, value: string) => void;
  clearPartnerParameters: () => void;
  logout: () => void;
  openURL: (url: string, options?: { newActivity?: boolean }) => void;
  createBranchUniversalObject: (
    identifier: string,
    options: BranchUniversalObjectOptions
  ) => Promise<BranchUniversalObject>;
  handleATTAuthorizationStatus: (
    ATTAuthorizationStatus: ATTAuthorizationStatus
  ) => void;
  getBranchQRCode: (
    settings: BranchQRCodeSettings,
    branchUniversalObject: BranchUniversalObjectOptions,
    linkProperties: BranchLinkProperties,
    controlParams: BranchLinkControlParams
  ) => Promise<string>;
  setPreInstallCampaign: (campaign: string) => void;
  setPreInstallPartner: (partner: string) => void;
  setDMAParamsForEEA: (eeaRegion: boolean, adPersonalizationConsent: boolean, adUserDataUsageConsent: boolean) => void;
  setConsumerProtectionAttributionLevel: (level: BranchAttributionLevel) => void;
  validateSDKIntegration: () => void;
  setSDKWaitTimeForThirdPartyAPIs: (waitTime: number) => void;
  setAnonID: (anonID: string) => void;
  setODMInfo: (odmInfo: string, firstOpenTimestamp: number) => void;
}
declare const branch: Branch;
export default branch;
