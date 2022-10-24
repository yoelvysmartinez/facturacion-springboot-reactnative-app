import { useState } from 'react';

export const useForm = <T extends Object>(initState: T) => {

    const [state, setState] = useState(initState);

    const onChange = (value: string| number, field: keyof T) => {
        setState({
            ...state,
            [field]: value
        });
    }

    const setFormData = (form: T) => {
        setState({
            ...state,
            ...form
        })
    }

    return {
        ...state,
        form: state,
        onChange,
        setFormData
    }

}