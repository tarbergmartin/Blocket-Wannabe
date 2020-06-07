import * as React from 'react';
import { MessageBar } from 'office-ui-fabric-react/lib/';
import { IAppMessageProps } from '../../interfaces/Interfaces';
import styles from '../../css/BlocketWannabe.module.scss';
import { useState, useEffect } from 'react';

export default function AppMessage({ appMessage }: IAppMessageProps) {

    if (!appMessage) {
        return null;
    }

    const [styleClass, setStyleClass] = useState('messageVisible');

    useEffect(() => {
        setStyleClass('messageVisible');
        setTimeout(() => {
            setStyleClass('messageHidden');
        }, 5000);
    }, [appMessage])

    return (
        <MessageBar
            className={styles[styleClass]}
            messageBarType={appMessage.messageBarType}
            isMultiline={false}>
            {appMessage.message}
        </MessageBar>
    )
}