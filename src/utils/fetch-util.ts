import axios from "axios"
import { env } from "./env"

export const fetchUtils = async (path: string) => {
    const api = `${env.base_url}${path}`
    const { data } = await axios.get(api)
    
    return data
}