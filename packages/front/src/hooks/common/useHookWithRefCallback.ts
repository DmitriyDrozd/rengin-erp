import {useCallback, useRef} from 'react'

export default function useHookWithRefCallback<T>() {
    const ref = useRef<T>(null)
    const setRef = useCallback( (node:T)     => {
        if (ref.current) {
            // Make sure to cleanup any events/references added to the last instance
        }

        if (node) {
            // Check if a node is actually passed. Otherwise node would be null.
            // You can now do what you need to, addEventListeners, measure, etc.
        }

        // Save a reference to the node
        ref.current = node
    }, [])

    return [setRef]
}
