import { Button, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";
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

const styles = require("./style.pcss");

interface Props {
    className?: string;
    deleteUpload: ActionCreator<DeleteUploadsAction>;
    goBack: ActionCreator<GoBackAction>;
    uploads: UploadTableRow[];
}

interface UploadJobsState {
    // array of fullpaths
    selectedFiles: string[];
}

class UploadJobs extends React.Component<Props, UploadJobsState> {
    private columns: Array<ColumnProps<UploadTableRow>> = [
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

    private get rowSelection(): any { // todo
        return {
            onChange: this.onSelectChange,
            selectedFiles: this.state.selectedFiles,
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedFiles: [],
        };
    }

    public render() {
        const {className, uploads} = this.props;
        const {selectedFiles} = this.state;

        return (
            <FormPage
                className={className}
                formTitle="UPLOAD JOBS"
                formPrompt="Review files below and click Upload to complete process."
                onBack={this.props.goBack}
            >
                <Button className={styles.deleteButton} onClick={this.removeUploads} disabled={isEmpty(selectedFiles)}>
                    Delete Selected
                </Button>
                <Table columns={this.columns} dataSource={uploads} rowSelection={this.rowSelection}/>
            </FormPage>
        );
    }

    private removeUpload = (upload: UploadTableRow) => {
        return () => {
            this.setState({selectedFiles: []});
            this.props.deleteUpload([upload.file]);
        };
    }

    private removeUploads = () => {
        this.setState({selectedFiles: []});
        this.props.deleteUpload(this.state.selectedFiles);
    }

    private onSelectChange = (selectedFiles: string[]) => {
        this.setState({selectedFiles});
    }
}

function mapStateToProps(state: State) {
    return {
        uploads: getUploadSummaryRows(state),
    };
}

const dispatchToPropsMap = {
    deleteUpload,
    goBack,
};

export default connect(mapStateToProps, dispatchToPropsMap)(UploadJobs);
