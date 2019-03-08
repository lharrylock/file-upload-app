import { ActionCreators as UndoActionCreators } from "redux-undo";
import { RedoAction, UndoAction } from "./types";

export function undo(): UndoAction {
    return UndoActionCreators.undo();
}

export function redo(): RedoAction {
    return UndoActionCreators.redo();
}
