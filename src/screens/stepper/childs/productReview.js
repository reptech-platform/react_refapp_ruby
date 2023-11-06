import React from 'react';
import RenderFormContols from "./formcontrols";

const Component = React.forwardRef((props, ref) => {

    const { setIsSubmitted, onEditClicked } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));

    const OnSubmit = async (e) => {
        setIsSubmitted(true);
    }

    const OnEditClicked = (e) => {
        if (onEditClicked) OnEditClicked(e);
    }

    return (
        <>
            <RenderFormContols {...props} excludestepper={true} shadow={true} review={true}
                onEditClicked={OnEditClicked} setForm={setForm} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;