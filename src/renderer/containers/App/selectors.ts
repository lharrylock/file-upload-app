import { createSelector } from "reselect";
import { getWellIdToWellLabelMap } from "../../state/selection/selectors";
import { getUpload } from "../../state/upload/selectors";
import { FileTag, UploadStateBranch, WellFileTag } from "../../state/upload/types";

// Result used by the FolderTree to display tags by each file with associated metadata
export const getFileToTags = createSelector([
    getUpload,
    getWellIdToWellLabelMap,
], (upload: UploadStateBranch, wellIdToWellLabel: Map<number, string>):
Map<string, FileTag[]> => {

    const fullPathToTags = new Map<string, FileTag[]>();
    for (const fullPath in upload) {
        // Don't include JavaScript object meta properties
        if (upload.hasOwnProperty(fullPath)) {
            const metadata = upload[fullPath];
            const tags: FileTag[] = [];

            if (metadata.wellId && wellIdToWellLabel.has(metadata.wellId)) {
                const wellTag: string = wellIdToWellLabel.get(metadata.wellId) || "";
                tags.push(new WellFileTag(wellTag));
            }

            fullPathToTags.set(fullPath, tags);
        }
    }
    return fullPathToTags;
});
