import useLedger from './useLedger'
import {getAbbrName} from 'iso/src/store/bootstrap/repos/users'

export default () => {
     const ledger = useLedger()
    const getClientFullAddress = (clientId) => {
     const client =   ledger.clientsById[clientId]
         if(client)
             return client.address_region+', '+ client.address_city +', '+ client.address_street
        return  ''
    }
    const list = ledger.contracts.map( c => {
        return ({
            managerFullName: ledger.usersById[c.managerId] ? getAbbrName(ledger.usersById[c.managerId]) : '',
            clientLegalName: ledger.clientsById[c.clientId] ? ledger.clientsById[c.clientId].legalName : '',
            clientFullAddress: getClientFullAddress(c.clientId),
            ...c
        })
    })

    return list
}