import { Table } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator } from "redux";
import FormPage from "../../components/FormPage";

import { State } from "../../state/types";
import { getUploadSummaryRows } from "../../state/upload/selectors";
import { UploadAction, UploadTableRow } from "../../state/upload/types";

// const styles = require("./style.pcss");

interface Props {
    className?: string;
    upload: ActionCreator<UploadAction>;
    uploadInProgress: boolean;
    uploads: UploadTableRow[];
}

class UploadJobs extends React.Component<Props, {}> {
    private columns: any[] = [
        {
            dataIndex: "barcode",
            key: "barcode",
            title: "Barcode",
        },
        {
            dataIndex: "file",
            key: "file",
            title: "File",
        },
        {
            dataIndex: "wellLabel",
            key: "wellLabel",
            title: "Well",
        },
        {
            key: "action",
            render: (text: string, record: UploadTableRow) => (<a onClick={this.removeUpload(record)}>Delete</a>),
            title: "Action",
        }];

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const {className, uploadInProgress, uploads} = this.props;

        return (
            <FormPage
                className={className}
                formTitle="UPLOAD JOBS"
                formPrompt="Review files below and click Upload to complete process."
                saveButtonDisabled={uploadInProgress}
                onSave={this.upload}
                saveInProgress={uploadInProgress}
            >
                <Table columns={this.columns} dataSource={uploads}/>
            </FormPage>
        );
    }

    private upload = (): void => {
        this.props.upload();
    }

    private removeUpload = (upload: UploadTableRow) => {
        return () => {
            // tslint:disable-next-line
            console.log("removing: ", upload);
        };
    }
}

function mapStateToProps(state: State) {
    return {
        uploads: getUploadSummaryRows(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(UploadJobs);
