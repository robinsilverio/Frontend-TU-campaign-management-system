export class ListUtils {
    constructor() {
    }

    findItemOfList(paramList, paramCondition){
        return paramList.find(paramCondition);
    }
    updateItemToList(paramList, paramCondition) {
        return paramList.map(paramCondition);
    }

}