import { useGetConsumablesQuery } from './consumablesApiSlice'
import { useParams } from 'react-router-dom'
import EditConsumableForm from './EditConsumableForm'

import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from "../../hooks/useAuth"
import useTitle from '../../hooks/useTitle'

const EditConsumable = () => {
    useTitle('Cost Tracking: Consumable')



    const {
        data: consumables,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetConsumablesQuery('consumablesList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })


    let content

    if (isSuccess) {

        if (!consumables) return <PulseLoader color={"#FFF"} />

        content = <EditConsumableForm consumables={consumables} />

        return content
    }
}
export default EditConsumable