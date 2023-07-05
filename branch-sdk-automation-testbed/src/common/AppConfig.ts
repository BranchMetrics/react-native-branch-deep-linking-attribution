import { CreateContent } from './../helper/BranchHelper';
import branch from 'react-native-branch';
const emptyData = {
    key1: 'value1',
};
function isEmpty(obj: object) {
    return Object.keys(obj).length === 0;
}
export class AppConfig {
    static instance: AppConfig;
    branchUniverSalObject: {} | undefined;

    metaData = {};

    private constructor() {
        console.log('constructor called!');
    }

    public static getInstance(): AppConfig {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig();
        }
        return AppConfig.instance;
    }

    public async createBranchObject(props: CreateContent, metaData: any) {
        let customData = isEmpty(metaData) ? emptyData : metaData;
        this.branchUniverSalObject = await branch.createBranchUniversalObject(props.contentIdentifier, {
            title: props.contentTitle,
            contentDescription: props.contentDescription,
            contentImageUrl: props.imageURL,
            contentMetadata: {
                customMetadata: customData,
            },
        });
        return this.branchUniverSalObject;
    }
    public async createBranchObjectWithLocalIndex(props: CreateContent, metaData: any) {
        let customData = isEmpty(metaData) ? emptyData : metaData;
        this.branchUniverSalObject = await branch.createBranchUniversalObject(props.contentIdentifier, {
            title: props.contentTitle,
            locallyIndex: true,
            contentDescription: props.contentDescription,
            contentMetadata: {
                customMetadata: customData,
            },
        });
        return this.branchUniverSalObject;
    }
    public addMetaDataObject(metaData: any) {
        this.metaData = metaData;
    }
    public getMetaData(): object {
        return this.metaData;
    }
    public clearMetaData() {
        this.metaData = {};
    }
}
