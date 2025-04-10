import { Fragment } from 'react';
import RenField from './RenField';
import { AnyMeta } from 'iso/src/store/bootstrap/core/valueTypes';

export default ({list}: { list: Array<AnyMeta & { customOptions?: { value: string, label: string }[] }> }) => {
    return (
        <>
            {list.map(f => (
                <Fragment key={f.name}>
                    <RenField meta={f} customOptions={f.customOptions}/>
                </Fragment>
            ))
            }
        </>
    );
}