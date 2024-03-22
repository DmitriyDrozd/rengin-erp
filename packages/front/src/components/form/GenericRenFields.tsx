import { Fragment } from 'react';
import RenField from './RenField';
import { AnyMeta } from 'iso/src/store/bootstrap/core/valueTypes';

export default ({list, customOptions}: { list: AnyMeta[], customOptions?: { value: string, label: string }[] }) => {
    return (
        <>
            {list.map(f => (
                <Fragment key={f.name}>
                    <RenField meta={f} customOptions={customOptions}/>
                </Fragment>
            ))
            }
        </>
    );
}