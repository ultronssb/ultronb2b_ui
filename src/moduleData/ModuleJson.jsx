import _ from "lodash";
import { data } from "./Json";

export function ModuleJson(parentId) {

    function buildTree(data, parentId = null) {
        return _.chain(data)
            .filter(item => item.parent_id === parentId)
            .sortBy('orderBy')
            .map(item => ({
                ...item,
                children: buildTree(data, item.id)
            }))
            .value();
    }

    return buildTree(data, parentId);
}

