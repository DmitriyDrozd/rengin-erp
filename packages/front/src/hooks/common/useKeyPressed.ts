import React from 'react'

export const useKey = ({onKeyDown, onKeyUp}: {onKeyDown: (e:KeyboardEvent)=> any, onKeyUp: (e:KeyboardEvent)=> any}) => {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = React.useState(false)

    // If pressed key is our target key then set to true
    const downHandler = (e: KeyboardEvent) => {

            onKeyDown(e)

    }

    // If released key is our target key then set to false
    const upHandler = (e) => {
        onKeyUp(e)
    }

    // Add event listeners
    React.useEffect(() => {
        window.addEventListener('keydown', downHandler, {capture: true})
        window.addEventListener('keyup', upHandler, {capture: true})

        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler)
            window.removeEventListener('keyup', upHandler)

        }
    }, []) // Empty array ensures that effect is only run on mount and unmount

    return keyPressed
}