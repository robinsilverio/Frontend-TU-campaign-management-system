export class ListUtils {
    constructor() {
    }

    addItemToList(paramList, paramItemToBeAdded) {
        paramList.push(paramItemToBeAdded);
        return paramList;
    }
    findItemOfList(paramList, paramCondition){
        return paramList.find(paramCondition);
    }
    updateItemToList(paramList, paramCondition) {
        return paramList.map(paramCondition);
    }
    removeItemFromList(paramList, paramItemToBeDeleted) {
        let indexOfToBeDeletedItem = paramList.indexOf(paramItemToBeDeleted);
        paramList.splice(indexOfToBeDeletedItem, 1);
        return paramList;
    }

}