import { useState, useEffect } from 'react';

export const useDebouncedValue = ( input: string = '' ) => {

    const [debouncedValue, setDebouncedValue] = useState(input);

    useEffect(() => {
        
        const timeout = setTimeout( () => {
            setDebouncedValue( input );
        }, 300 )

        return () => {
            clearTimeout( timeout );
        }
    }, [input])


    return debouncedValue;
}