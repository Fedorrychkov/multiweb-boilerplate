// @ts-expect-error: React import is necessary for JSX
import React from 'react';

type Props = {
    title: string;
    body: string;
};

export const TemplatePage = ({ title, body }: Props) => {
    return (
        <div>
            <h1>{title}</h1>
            <p>{body}</p>
        </div>
    );
};
