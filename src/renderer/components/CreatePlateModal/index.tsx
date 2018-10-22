import { Modal } from "antd";
import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.css");

export interface CreatePlateModalProps {
    className?: string;
    visible: boolean;
    confirmLoading: boolean;
    onOk: () => void;
    onCancel: () => void;
}

const CreatePlateModal: React.SFC<CreatePlateModalProps> = (props) => {
    const {
        className,
        confirmLoading,
        onCancel,
        onOk,
        visible,
    } = props;

    return (
        <Modal
            className={classNames(styles.container, className)}
            title="Create Plate"
            visible={visible}
            onOk={onOk}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
        >
            <p>Labkey</p>
        </Modal>
    );
};

export default CreatePlateModal;
