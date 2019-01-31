import { Button } from "antd";
import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.css");

interface FormPageProps {
    backButtonDisabled?: boolean;
    children: JSX.Element | JSX.Element[] | string;
    className?: string;
    formTitle: string;
    formPrompt: string;
    saveButtonName?: string;
    saveButtonDisabled?: boolean;
    onSave?: () => any;
    backButtonName?: string;
    onBack?: () => any;
}

class FormPage extends React.Component<FormPageProps, {}> {
    private static defaultProps = {
        backButtonDisabled: false,
        backButtonName: "Go Back",
        saveButtonDisabled: false,
        saveButtonName: "Save and Continue",
    };

    constructor(props: FormPageProps) {
        super(props);
        this.state = {};
        this.onSave = this.onSave.bind(this);
        this.onBack = this.onBack.bind(this);
    }

    public render() {
        const {
            backButtonDisabled,
            backButtonName,
            children,
            className,
            formPrompt,
            formTitle,
            onSave,
            onBack,
            saveButtonDisabled,
            saveButtonName,
        } = this.props;
        const {} = this.state;

        return (
            <div className={classNames(className, styles.container)}>
                <div className={styles.content}>
                    <div className={styles.title}>{formTitle}</div>
                    <div className={styles.formPrompt}>
                        {formPrompt}
                    </div>
                    <div className={styles.form}>
                        {children}
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    {onBack ? <Button
                        size="large"
                        onClick={this.onBack}
                        disabled={backButtonDisabled}
                    >
                        {backButtonName}
                    </Button> : <div/>}
                    {onSave ? <Button
                        type="primary"
                        size="large"
                        onClick={this.onSave}
                        disabled={saveButtonDisabled}
                    >
                        {saveButtonName}
                    </Button> : <div/>}
                </div>
            </div>
        );
    }

    private onSave(): void {
        if (this.props.onSave) {
            this.props.onSave();
        }
    }

    private onBack(): void {
        if (this.props.onBack) {
            this.props.onBack();
        }
    }
}

export default FormPage;
