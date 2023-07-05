import { StackActions, createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: any, params: any) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}
export function replace(name: any, params: any) {
    if (navigationRef.isReady()) {
        navigationRef.current.dispatch(StackActions.replace(name, params));
        //navigationRef.repl(name, params);
    }
}
