import React,{useState} from 'react'
import { FullPageLoader } from '../components/FullPageLoader'

const useFullPageLoader = () => {
    const [loading,setLoading]=useState=useState(false)
    return [
        loading ? <FullPageLoader></FullPageLoader>:null,
        ()=>setLoading(true),//Show loader
        ()=>setLoading(false)//Hide loader
    ]
}

export default useFullPageLoader