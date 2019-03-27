import { Table } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator } from "redux";
import FormPage from "../../components/FormPage";
import { goBack } from "../../state/selection/actions";
import { GoBackAction } from "../../state/selection/types";

import { State } from "../../state/types";
import { deleteUpload } from "../../state/upload/actions";
import { getUploadSummaryRows } from "../../state/upload/selectors";
import { DeleteUploadsAction, UploadTableRow } from "../../state/upload/types";

// const styles = require("./style.pcss");

interface Props {
    className?: string;
    deleteUpload: ActionCreator<DeleteUploadsAction>;
    goBack: ActionCreator<GoBackAction>;
    // upload: ActionCreator<UploadAction>;
    uploadInProgress: boolean;
    uploads: UploadTableRow[];
}

interface UploadJobsState {
    selectedRowKeys: string[];
}

class UploadJobs extends React.Component<Props, UploadJobsState> {
    private columns: any[] = [ // todo type
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

    private get rowSelection(): any {
        return {
            onChange: this.onSelectChange,
            selectedRowKeys: this.state.selectedRowKeys,
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
        };
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
                saveButtonName="Upload"
                onBack={this.props.goBack}
            >
                <Table columns={this.columns} dataSource={uploads} rowSelection={this.rowSelection}/>
            </FormPage>
        );
    }

    private upload = (): void => {
        // this.props.upload();
    }

    private removeUpload = (upload: UploadTableRow) => {
        return () => {
            this.props.deleteUpload([upload.file]);
        };
    }

    private onSelectChange = (selectedRowKeys: string[]) => {
        this.setState({selectedRowKeys});
    }
}

function mapStateToProps(state: State) {
    return {
        uploadInProgress: false, // todo
        uploads: getUploadSummaryRows(state),
    };
}

const dispatchToPropsMap = {
    deleteUpload,
    goBack,
};

export default connect(mapStateToProps, dispatchToPropsMap)(UploadJobs);
