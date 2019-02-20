import { expect } from "chai";

import createReduxStore from "../../configure-store";
import { mockState } from "../../test/mocks";
import { HTTP_STATUS } from "../../types";
import { setAlert } from "../actions";
import { httpStatusToMessage } from "../logics";
import { getAlert } from "../selectors";
import { AlertType } from "../types";

describe("Feedback logics", () => {

    describe("setAlertLogic", () => {
        it("Updates message if alert has a recognized statusCode", (done) => {
            const store = createReduxStore(mockState);
            store.subscribe(() => {
                const alert = getAlert(store.getState());
                expect(alert).to.not.be.undefined;

                if (alert) {
                    expect(alert.message).to.equal(httpStatusToMessage.get(HTTP_STATUS.BAD_REQUEST));
                }
                done();
            });
            store.dispatch(setAlert({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                type: AlertType.WARN,
            }));
        });

        it("Does not update message if alert does not have a statusCode", (done) => {
            const store = createReduxStore(mockState);
            const message = "Hello";
            store.subscribe(() => {
                const alert = getAlert(store.getState());
                expect(alert).to.not.be.undefined;

                if (alert) {
                    expect(alert.message).to.equal(message);
                }
                done();
            });
            store.dispatch(setAlert({
                message,
                type: AlertType.INFO,
            }));
        });

        it("Does not update message if alert already has a message", (done) => {
            const store = createReduxStore(mockState);
            const message = "Hello world";
            store.subscribe(() => {
                const alert = getAlert(store.getState());
                expect(alert).to.not.be.undefined;

                if (alert) {
                    expect(alert.message).to.equal(message);
                }
                done();
            });
            store.dispatch(setAlert({
                message,
                statusCode: HTTP_STATUS.BAD_REQUEST,
                type: AlertType.INFO,
            }));
        });
    });
});
