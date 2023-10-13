import { useState, useEffect, useMemo, memo, useRef, Component } from "react"
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateConsumablesMutation, useDeleteConsumableMutation } from './consumablesApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"

let rowId = 0
let eConsumables = {}
// Button definition for buttons in Ag-grid
const btnStyle = { padding: "2px", height: "70%", fontSize: "11px" }
const divButton = { display: "flex", flexFlow: "row nowrap", justifyContent: "flex-start", padding: "1px", gap: "0.5em" }

class BtnCellRenderer extends Component {
    constructor(props, Id) {
        super(props);
        this.btnClickedHandler = this.btnClickedHandler.bind(this);
        this.btnDelClickedHandler = this.btnDelClickedHandler.bind(this);
    }
    btnClickedHandler() {
        this.props.clicked(this.props.value);
    }
    btnDelClickedHandler(e) {
        //e.preventDefault()
        this.props.delClicked(this.props);
    }
    render() {
        return (
            <div className="form-group -dash-header__nav " style={divButton}>
                <button className="btn btn-danger btn-sm" style={btnStyle} onClick={this.btnDelClickedHandler}>Del</button>
            </div>
        )
    }
}
const EditConsumableForm = ({ consumables }) => {

    const [updateConsumables, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateConsumablesMutation()
    const [deleteConsumable, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteConsumableMutation()
    const navigate = useNavigate()
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            width: 150,
        };
    }, []);
    const consumableGridRef = useRef();
    const blankData = { "type": "", "name": "", "capacity": 0, "_id": "" }
    const data = Array.from(consumables).map((data, index) => ({
        "type": data.type,
        "name": data.name,
        "capacity": data.capacity ? parseFloat(data.capacity) : 0,
        "_id": data._id
    }))
    const [rdConsumable, setRdConsumable] = useState(data)
    const [consumableColDefs, setConsumableColDefs] = useState([
        { field: '_id', headerName: 'Id', width: 150 },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        { field: "type", headerName: 'Type', width: 150, editable: true },
        { field: "capacity", headerName: 'Capacity', width: 150, editable: true },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                delClicked: function (eprops) {
                    if (this.data._id) { delRecord(this.data._id) }
                    this.api.applyTransaction({ remove: [this.data] });
                    const OtherRdConsumable = rdConsumable.filter((row) =>
                        row.rowId !== this.data._id
                    )
                    setRdConsumable(OtherRdConsumable)
                },
                Id: "consumable"
            },
        }
    ])

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    let errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const onSaveClicked = async (e) => {
        e.preventDefault()
        // if (canSave) {
        eConsumables.data = rdConsumable
        let result
        memo(
            result = await updateConsumables(eConsumables)
        )
        console.log(result)
        // }
    }
    const delRecord = async (_id) => {
        await deleteConsumable({ id: _id })
    }
    const onValueChanged = (e) => {
        console.log('onValueChanged-rowData:' + JSON.stringify(rdConsumable))
    }
    const onNewClicked = (e) => {
        e.preventDefault()
        let newRData =
            rdConsumable ?
                [...rdConsumable, blankData]
                : [blankData]
        setRdConsumable(newRData)
    }
    const errRef = useRef();
    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            errRef.className = "resmsg"
            isSuccess ? errContent = " Saved!"
                : errContent = "Deleted!"
            navigate('/site/consumables')
        }
    }, [isSuccess, isDelSuccess, navigate])
    const content = (
        <>
            <p ref={errRef} className={errClass}>{errContent}</p>
            <div className="panel panel-default" id="resourceDIV" style={{ fontSize: '14px' }}>
                <div className="panel-heading"><h5>Consumables</h5></div>
                <div className="form-group  dash-header__nav">
                    <button
                        className="btn btn-primary"
                        title="New"
                        onClick={onNewClicked}
                    >
                        <FontAwesomeIcon icon={faPlusSquare} />
                    </button>
                    <button
                        className="btn btn-primary"
                        title="Save"
                        onClick={onSaveClicked}
                    >
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                </div>
                <div className="panel-body">
                    <div className="container-sm ag-theme-balham" style={{ height: 200, width: "100%", fontSize: '12px' }}>
                        <AgGridReact
                            ref={consumableGridRef}
                            onCellValueChanged={onValueChanged}
                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                            defaultColDef={defaultColDef}
                            rowData={rdConsumable}
                            columnDefs={consumableColDefs}>
                        </AgGridReact>
                    </div>
                </div>
            </div>
        </>
    )

    return content

}

export default EditConsumableForm