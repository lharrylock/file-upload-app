import { Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { connect } from "react-redux";
import FormPage from "../../components/FormPage";

import { State } from "../../state/types";

// const styles = require("./style.pcss");

interface Props {
    className?: string;
}

class UploadSummary extends React.Component<Props, {}> {
    private columns: Array<ColumnProps<any>> = [
        {
            dataIndex: "id",
            key: "jobId",
            title: "Job Id",
        },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
        },
        {
            dataIndex: "created",
            key: "created",
            title: "Created",
        },
    ];

    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        const {className} = this.props;
        return (
            <FormPage
                className={className}
                formTitle="UPLOAD STATUSES"
                formPrompt=""
            >
                <Table columns={this.columns} dataSource={this.getUploadJobs()}/>
            </FormPage>
        );
    }

    private getUploadJobs(): any[] {
        return [];
    }
}

function mapStateToProps(state: State) {
    return {};
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(UploadSummary);
