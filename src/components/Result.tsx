import React from "react";

interface Props {
    value: string
}

const Result: React.FC<Props> = props => {
    return (
        <div className="result">{props.value}</div>
    );
}

export default Result;