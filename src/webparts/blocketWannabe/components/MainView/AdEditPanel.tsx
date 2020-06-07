import * as React from 'react';
import { PanelType, Panel } from 'office-ui-fabric-react';
import AdForm from '../Shared/AdForm';

export default function AdEditPanel(props: any) {

    return (
        <Panel
            isOpen={props.show}
            type={PanelType.smallFixedFar}
            headerText="Edit"
            closeButtonAriaLabel="Close"
            onDismiss={props.onDismiss}>
        <AdForm
            existingAd={props.ad}
            categories={props.categories}
            web={props.web}
            isUserAdmin={props.isUserAdmin}
            onSubmit={props.onSubmit}
            context={props.context} />
        </Panel>
    )
}