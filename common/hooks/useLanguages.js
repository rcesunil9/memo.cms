import { useEffect, useState } from "react"
import { getLanguages } from "../services/targetMarket"

// custom hook for retrieving languages list
// returns an array of languages
function useLanguages(defaultState) {

    // useState hook to manage list of languages
    const [languages, setLanguages] = useState(defaultState || [])

    // useEffect hook is a combined componentDidMount|componentDidUpdate
    // empty array second parameter is here to only subscribe on componentDidMount
    // to avoid looping on the ajax call for every update
    useEffect(() => {

        // retrieve languages
        getLanguages().then(res => setLanguages(res.data || []))

    }, [])

    return languages

}

export default useLanguages
